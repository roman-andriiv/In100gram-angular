import {Component, OnInit} from '@angular/core';
import {Post} from "../../models/Post";
import {CommentService} from "../../services/comment.service";
import {NotificationService} from "../../services/notification.service";
import {ImageUploadService} from "../../services/image-upload.service";
import {PostService} from "../../services/post.service";

@Component({
  selector: 'app-user-posts',
  templateUrl: './user-posts.component.html',
  styleUrls: ['./user-posts.component.css']
})
export class UserPostsComponent implements OnInit {

  isUserPostsLoaded = false;
  posts: Post[];

  constructor(private postService: PostService,
              private commentService: CommentService,
              private notificationService: NotificationService,
              private imageService: ImageUploadService) {
  }

  ngOnInit(): void {
    this.postService.getPostForCurrentUser()
      .subscribe(data => {
        console.log(data);
        this.posts = data;
        this.getImagesToPosts(this.posts);
        this.getCommentsToPosts(this.posts);
        this.isUserPostsLoaded = true;
      });
  }

  getImagesToPosts(posts: Post[]) {
    posts.forEach(p => {
      this.imageService.getPostImage(p.id)
        .subscribe(data => {
          p.image = data.imageBytes;
        });
    });
  }

  getCommentsToPosts(posts: Post[]) {
    posts.forEach(p => {
      this.commentService.getPostComments(p.id)
        .subscribe(data => {
          p.comments = data;
        });
    });
  }

  removePost(post: Post, index: number) {
    console.log(post);
    const result = confirm('Do you really want to delete this post?');
    if (result) {
      this.postService.deletePost(post.id)
        .subscribe(() => {
          this.posts.splice(index, 1);
          this.notificationService.showSnackBar('Post deleted');
        });
    }
  }

  formatImage(img: any): any {
    if (img == null) {
      return null;
    }
    return 'data:image/jpeg;base64,' + img;
  }

  deleteComment(commentId: number, postIndex: number, commentIndex: number) {
    const post = this.posts[postIndex];

    this.commentService.deleteComment(commentId)
      .subscribe(() => {
        post.comments.splice(commentIndex, 1);
        this.notificationService.showSnackBar('Comment removed');
      });
  }
}
