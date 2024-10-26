import { Request, Response } from 'express';
import bcrytp from 'bcrypt';
import { User } from '../entities/User';
import { AppDataSource } from '../db';
import { Product } from '../entities/Product';



export const getProducts = async (req: Request, res: Response) => {
    try {

        const products = await AppDataSource
            .getRepository(Product)
            .createQueryBuilder('product')
            .getMany();

        return res.json({ products, errorCode: 0 });

    } catch (error) {
        if (error instanceof Error)
            return res.status(500).json({ message: error.message, errorCode: 2 });
    }

}

export const createProduct = async (req: Request, res: Response) => {
    try{

        const { image, name, points } = req.body;

        await AppDataSource
            .getRepository(Product)
            .createQueryBuilder('product')
            .insert()
            .into(Product)
            .values([
                { image, name, points, active: true }
            ])
            .execute();

        return res.json({ message: "Producto creado", errorCode: 0 });

    } catch (error) {
        if (error instanceof Error)
            return res.status(500).json({ message: error.message, errorCode: 2 });
    }

}



export const exchangeProduct = async (req: Request, res: Response) => {
    try {
        const { points, user } = req.body;

        //Obtener el usuario a canjear
        const findedUser = await AppDataSource
        .getRepository(User)
        .createQueryBuilder('user')
        .where('user.id = :id', { id: user })
        .getOne();

        if(!findedUser)  return res.json({ message: "Usuario no existe", errorCode: 1 });

        if(findedUser.exchangePoints == 0)  return res.json({ message: "Usuario no cuenta con puntos suficientes", errorCode: 1 });

        if(findedUser.exchangePoints < points)  return res.json({ message: "Usuario no cuenta con puntos suficientes", errorCode: 1 });

        //Actualizar los puntos del usuario despues de canjear
        await AppDataSource
            .getRepository(User)
            .createQueryBuilder('user')
            .update(User)
            .set({ exchangePoints: findedUser.exchangePoints - points })
            .where("id = :id", { id: user })
            .execute();

        return res.json({ message: "Producto canejado, se restaron puntos del usuario", errorCode: 0 });

    } catch (error) {
        if (error instanceof Error)
            return res.status(500).json({ message: error.message, errorCode: 2 });
    }

}