import { JwtPayload } from "jsonwebtoken";
import { Wallet } from "./wallet.model";
import { IWallet } from "./wallet.interface";
import { QueryBuilder } from "../../utils/queryBuilders";


const getAllWallets = async (query : Record<string,string>) => {
    const queryBuilder = new QueryBuilder(Wallet.find().populate("owner","name email"),query)


    const walletData = queryBuilder
    .filter()
    .sort()
    .fields()
    .pagination()

    const [data,meta] = await Promise.all([
        walletData.build(),
        queryBuilder.getMeta()
    ])

    return {
        data,
        meta
        
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