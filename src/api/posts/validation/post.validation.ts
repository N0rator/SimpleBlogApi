import { object, string, number, date, SchemaOf } from 'yup';
import { Post } from '../models/post.model';

const addPostSchema: SchemaOf<Post> = object({
    id: number().required().integer().positive(),
    title: string().required(),
    body: string().required(),
    userId: number().required().integer().positive(),
});

const updatePostSchema = object({
    title: string().required(),
    body: string().required(),
    userId: number().required().integer().positive(),
});

const patchPostSchema = object({
    title: string().nullable(),
    body: string().nullable(),
    userId: number().nullable().integer().positive(),
});

export {addPostSchema, updatePostSchema, patchPostSchema};