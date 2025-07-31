import { JwtPayload } from "jsonwebtoken";
import { Wallet } from "./wallet.model";
import { IWallet } from "./wallet.interface";

const getAllWallets = async () => {

    const users = await Wallet.find({}).populate("owner", "name email");

    const totalUser = await Wallet.countDocuments()


    return {
        data: users,
        meta: {
            total: totalUser
        }
    }
}


const getMyWallet = async(decodedToken : JwtPayload) =>{

    const myWallet = await Wallet.findOne({owner : decodedToken.userId}).populate("owner","name")

    return{
        data : myWallet
    }
}


const getSingleWallet = async(id :string) =>{
    const wallet = await Wallet.findById(id)
    return{
        data:wallet
    }
}


const updateWallet =async(id :string, payload : Partial<IWallet>) =>{

    const isWalletExist = await Wallet.findById(id)

    if(!isWalletExist){
        throw new Error("wallet not found")
    }

    const updatedWallet = await Wallet.findByIdAndUpdate(id,payload,{new:true,runValidators:true})


    return updatedWallet

}



export const WalletService ={
    getAllWallets,
    getMyWallet,
    getSingleWallet,
    updateWallet
}