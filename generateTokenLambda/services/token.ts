import { sign } from 'jsonwebtoken';
import { saveData } from '../repositories/redis.repository';
import { APIGatewayProxyEvent } from 'aws-lambda';

/**
 * Init process to Generate Token
 *
 * @param event
 */
export const token = async (event: APIGatewayProxyEvent): Promise<any> => {
    /**
     * Token Header exists
     */
    const tokenHeader = event.headers.token;

    if (!tokenHeader) throw 'Missing Token';

    /**
     *  Token Header Validation
     */
    const validToken = validateToken(tokenHeader);

    if (!validToken) throw 'Invalid Token';

    const body = JSON.parse(event.body ?? '');

    /**
     *  Fields Validation
     */
    const { card_number, cvv, expiration_month, expiration_year, email } = body;

    if (!card_number || !cvv || !expiration_month || !expiration_year || !email) throw 'Missing Fields';

    /**
     *  Generate Token
     */
    const token = await generateToken(body);

    const data = {
        ...body,
        token: token,
    };

    /**
     *  Save into Redis
     */
    // await saveData(data);

    return data;
};

/**
 * Simple Token Validation
 *
 * @param token
 */
export const validateToken = (token: string): boolean => {
    const secret_token = 'pk_test_0ae8dW2FpEAZlxlz';
    return token === secret_token;
};

/**
 * Generate Token with Data
 *
 * @param body
 */
export const generateToken = async (body: any): Promise<string> => {
    const jwtSecretKey: any = process.env.JWT_SECRET;

    const data = {
        ...body,
        time: Date(),
    };

    return sign(data, jwtSecretKey, { expiresIn: '15m' });
};
