import { createClient } from 'redis';

export const saveData = async (body: any): Promise<void> => {
    try {
        const hostredis = process.env.HOST_REDIS;
        /**
         *  Set connection and save
         */
        const client = createClient({
            url: hostredis,
        });

        await client.connect();

        await client.set('data', JSON.stringify(body));

        await client.disconnect();
    } catch (err) {
        throw err;
    }
};
