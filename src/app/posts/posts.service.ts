import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Post } from './post.model';

@Injectable({providedIn: 'root'})

export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  getPosts() {
    this.http.get<{message: string, posts: Post[]}>('https://tax-plus-node.solareenlo.now.sh/app.js')
      .subscribe((postData) => {
        this.posts = postData.posts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = {id: null, title, content};
    this.http
      .post<{message: string}>('https://tax-plus-node.solareenlo.now.sh/app.js', post)
      .subscribe((responseData) => {
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        console.log(responseData.message);
      });
  }
}
