import { Router, Request, Response, NextFunction } from "express";
import { Logger } from "../../lib/logger";
import { Post } from "./models/post.model";
import PostsService from "./services/posts.service";
import * as specification from './validation/post.validation';
import PostNotFoundException from "./exceptions/postNotFound.exception";
import { ValidationError } from "yup";
import PostNotValidException from "./exceptions/postNotValid.exception";

class PostsController {

    public readonly path = '/posts';
    public readonly router = Router();

    private static _service = new PostsService();

    constructor() {
        this.router.get(this.path, this.getPosts);
        this.router.get(this.path + '/:id', this.getPost);
        this.router.post(this.path, this.addPost);
        this.router.delete(this.path + '/:id', this.deletePost);
        this.router.put(this.path + '/:id', this.updatePost);
        this.router.patch(this.path + '/:id', this.patchPost);
    }

    getPosts(request: Request, response: Response<Post[]>, next: NextFunction) {
        const posts = PostsController._service.getPosts();
        response.send(posts);
    }

    getPost(request: Request<{ id: string }>, response: Response<Post>, next: NextFunction) {
        const id: number = parseInt(request.params.id);

        try {
            const post = PostsController._service.getPost(id);
            response.send(post);
        }
        catch(e) {
            next(new PostNotFoundException(id.toString()));
        }
    }

    addPost(request: Request<{}, {}, Post>, response: Response, next: NextFunction) {
        try{
            specification.addPostSchema.validateSync(
                request.body,
                {
                    abortEarly: false,
                    strict: true
                }
            );
        }
        catch(e) {
            next(new PostNotValidException(e as ValidationError));
            return;
        }

        const post: Post = request.body;

        const newPost = PostsController._service.addPost(post);
        response.send(newPost);
    }

    deletePost(request: Request<{ id: string }>, response: Response<{}>, next: NextFunction) {
        
        const id: number = parseInt(request.params.id);

        try {
            PostsController._service.deletePost(id);
            response.send();
        }
        catch(e) {
            next(new PostNotFoundException(id.toString()));
        }
    }

    updatePost(request: Request<{ id: string }, {}, Post>, response: Response<Post>, next: NextFunction) {
        try{
            specification.updatePostSchema.validateSync(
                request.body,
                {
                    abortEarly: false,
                    strict: true
                }
            );
        }
        catch(e) {
            next(new PostNotValidException(e as ValidationError));
            return;
        }

        const id: number = parseInt(request.params.id);
        const postData: Post = request.body;

        postData.id = id;

        try {
            const updatedPost = PostsController._service.updatePost(postData);
            response.send(updatedPost);
        }
        catch(e) {
            next(new PostNotFoundException(id.toString()));
        }
    }

    patchPost(request: Request<{ id: string }, {}, Post>, response: Response<Post>, next: NextFunction) {
        try{
            specification.patchPostSchema.validateSync(
                request.body,
                {
                    abortEarly: false,
                    strict: true
                }
            );
        }
        catch(e) {
            next(new PostNotValidException(e as ValidationError));
            return;
        }

        const id: number = parseInt(request.params.id);
        const postData: Post = request.body;

        postData.id = id;

        try {
            const updatedPost = PostsController._service.updatePost(postData);
            response.send(updatedPost);
        }
        catch(e) {
            next(new PostNotFoundException(id.toString()));
        }
    }
}

export default PostsController;