import { Transaction } from "../transaction/transaction.model"
import { User } from "../user/user.model"
import { Wallet } from "../wallet/wallet.model"

const now = new Date()
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7)


const getUserStats = async () => {
    const totalUserPromise = User.countDocuments()
    // const totalUsersPromise = User.countDocuments({ role: Role.USER })
    // const totalAgentPromise = User.countDocuments({ role: Role.AGENT })
    const totalWalletPromise = Wallet.countDocuments()
    const totalActiveWalletPromise = Wallet.countDocuments({ isBlocked: false })
    const totalInActiveWalletPromise = Wallet.countDocuments({ isBlocked: true })
    

    const newUsersInLast7Promise = User.countDocuments({ createdAt: { $gte: sevenDaysAgo } })


    const usersByRolePromise = User.aggregate([
        // stage-1-grouping users by role
        {
            $group: {
                _id: "$role",
                count: { $sum: 1 }
            }
        }
    ])


    const [totalUsers,  totalWallet, totalActiveWallet, newUserInLast7, totalInActiveWallet,usersByRole] = await Promise.all([
        totalUserPromise,
        // totalAgentPromise,
       totalWalletPromise,
        totalActiveWalletPromise,
        newUsersInLast7Promise,
        totalInActiveWalletPromise,
        usersByRolePromise
    ])

    return {
        totalUsers,
        // totalAgent,
        totalWallet,
        totalActiveWallet,
        totalInActiveWallet,
        newUserInLast7,
        usersByRole
        
    }

}

const getTransactionStats = async () => {
    const totalTransactionPromise = Transaction.countDocuments()
    
    const transactionByTypesPromise = Transaction.aggregate([
        {
            $group :{
                _id : "$types",
                count : {$sum : 1}
            }
        }
    ])

    const [totalTransaction,transactionByTypes] =await Promise.all([
        totalTransactionPromise,
        transactionByTypesPromise
    ])


    return {
        totalTransaction,
        transactionByTypes
    }
}


export const statsService = {
    getUserStats,
    getTransactionStats
}