import redis from "@redis";

type KeyProps = {
    object: string,
    value: string | number 
}

const EXPIRE_CACHE: number = 300


async function findWithKey(key: KeyProps, model: any) {
    const keyInRedis = `cache:${key.object}:${key.value}`;
    const value = await redis.get(keyInRedis)

    if(!value) {
        const document = await model.findOne({[key.object]: key.value});

        if(!document) return null;

        await redis.set(keyInRedis, JSON.stringify(document), "EX", EXPIRE_CACHE);

        return document
    }
    else {
        return JSON.parse(value);
    }
}


type FieldsProps = {
    op: "$set" | "$inc" | "$unset";
    fieldName: string;
    value: unknown;
};

async function updateAndCreate(
    key: KeyProps,
    model: any,
    fields: FieldsProps[]
) {
    const update: Record<string, Record<string, unknown>> = {};

    for (const field of fields) {
        if (!update[field.op]) {
            update[field.op] = {};
        }

        update[field.op]![field.fieldName] = field.value;
    }

    const document = await model.findOneAndUpdate(
        { [key.object]: key.value },
        update,
        {
            new: true,
            upsert: true
        }
    );

    const keyInRedis = `cache:${key.object}:${key.value}`;

    await redis.set(
        keyInRedis,
        JSON.stringify(document),
        "EX",
        EXPIRE_CACHE
    );

    return document;
}



export const dbHelpers = {
    find: findWithKey,
    updateAndCreate
}