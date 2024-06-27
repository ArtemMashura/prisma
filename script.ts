import { PrismaClient } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
const prisma = new PrismaClient()


async function main() {
    // await prisma.user.deleteMany()




    // const users = await prisma.user.findMany()
    // console.log(users)
    // const userSettings = await prisma.userSettings.findMany()
    // console.log(userSettings)




    // await prisma.user.update({
    //     where: {
    //         email: "12312312sd3"
    //     },
    //     data: {
    //         UserSettings: {
    //             update: {
    //                 emailUpdates: false
    //             }
    //         }
    //     }
    // })





    // const user = await prisma.user.create({
    //     data: {
    //         name: "assdd",
    //         age: 1234,
    //         email: "as",
    //         UserSettings: {
    //             create: {
    //                 emailUpdates: true
    //             }
    //         }
    //     },
    //     include: {
    //         UserSettings: true
    //     }
    // })




    // const post = await prisma.post.create({
    //     data: {
    //         title: "test",
    //         averageRating: 4.5,
    //         authorId: "b61a39a4-e223-460b-83fa-f4e68fb0c307"
    //     }
    // })

    // console.log(post)

    // const posts = await prisma.user.findFirst({
    //     include: {writtenPosts: true }
    // })

    // console.log(posts)

    // const post = await prisma.user.update({
    //     where: {
    //         id: "70921ea4-1622-4653-af4f-c2b544b2ee28"
    //     },
    //     data: {
    //         favoritePosts: {
    //             connect: {
    //                 id: 1
    //             }
    //         }
    //     }
    // })

    // console.log(post)




    // const user = await prisma.user.findMany({
        
    //     include: {favoritePosts: true, writtenPosts: true}
    // })

    // console.log(user)

    // await prisma.user.update({
    //     where: {
    //         email: "12312312sd3"
    //     },
    //     data: {
    //         UserSettings: {
    //             update: {
    //                 emailUpdates: false
    //             }
    //         }
    //     }
    // })






    // const subtract = prisma.user.update({
    //     where: {
    //         id: "70921ea4-1622-4653-af4f-c2b544b2ee28"
    //     },
    //     data: {
    //         money: {
    //             decrement: 100.5
    //         }
    //     }
    // })

    // const add = prisma.user.update({
    //     where: {
    //         id: "b61a39a4-e223-460b-83fa-f4e68fb0c307"
    //     },
    //     data: {
    //         money: {
    //             increment: 100.5
    //         }
    //     }
    // })

    // const transfer = prisma.transfer.create({
    //     data: {
    //         ammount: 100.5,   
    //         fromId: "70921ea4-1622-4653-af4f-c2b544b2ee28",    
    //         toId: "b61a39a4-e223-460b-83fa-f4e68fb0c307",      
    //     }
    // })

    // console.log(await prisma.$transaction([subtract, add, transfer]))
    
    // await transfer('alice@prisma.io', 'bob@prisma.io', 100.5)





    // console.log(await transfer('70921ea4-1622-4653-af4f-c2b544b2ee28', 'b61a39a4-e223-460b-83fa-f4e68fb0c307', 100.5))

}

main()
    .catch(e => {
        console.log(e.message)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

function transfer(from: string, to: string, amount: number) {
    return prisma.$transaction(async (tx) => {
        // 1. Decrement amount from the sender.
        const sender = await tx.user.update({
        data: {
            money: {
                decrement: amount,
            },
        },
        where: {
            id: from,
        },
        })
   
        // 2. Verify that the sender's balance didn't go below zero.
        if (sender.money < new Decimal(0)) {
            throw new Error(`${from} doesn't have enough to send ${amount}`)
        }
    
        // 3. Increment the recipient's balance by amount
        const recipient = await tx.user.update({
        data: {
            money: {
                increment: amount,
            },
        },
        where: {
            id: to,
        },
        })

        const transfer = await prisma.transfer.create({
            data: {
                ammount: amount,   
                fromId: from,    
                toId: to,      
            }
        })
    
        return [sender, recipient, transfer]
    })
    }