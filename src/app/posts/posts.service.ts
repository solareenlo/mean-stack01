import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Post } from './post.model';

const host1 = 'http://localhost:3001/api/v1';
const host2 = 'https://thetangle.jp';

@Injectable({providedIn: 'root'})

export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  getPosts() {
    this.http.get<{message: string, posts: Post[]}>(host1)
      .subscribe((postData) => {
        this.posts = postData.posts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    // const post: Post = {id: null, title, content};
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http
      .post<{message: string; post: Post}>(host1, postData)
      .subscribe((responseData) => {
        const post: Post = {
          id: responseData.post.id,
          title,
          content,
          imagePath: responseData.post.imagePath};
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        console.log(responseData.message, post);
      });
  }
}
