import {Component, OnInit} from '@angular/core';
import {Post} from "../../models/Post";
import {User} from "../../models/User";
import {UserService} from "../../services/user.service";
import {PostService} from "../../services/post.service";
import {CommentService} from "../../services/comment.service";
import {NotificationService} from "../../services/notification.service";
import {ImageUploadService} from "../../services/image-upload.service";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  isPostsLoaded = false;
  posts: Post[];
  isUserLoaded = false;
  user: User;

  constructor(
    private userService: UserService,
    private postService: PostService,
    private commentService: CommentService,
    private notificationService: NotificationService,
    private imageService: ImageUploadService
  ) {
  }

  ngOnInit(): void {
    this.postService.getAllPosts().subscribe(data => {
      console.log(data);
      this.posts = data;
      this.getCommentsToPosts(this.posts);
      this.getImagesToPosts(this.posts);
      this.isPostsLoaded = true;
    });

    this.userService.getCurrentUser().subscribe(data => {
      console.log(data);
      this.user = data;
      this.isUserLoaded = true;
    });
  }

  getImagesToPosts(posts: Post[]) {
    posts.forEach(p => {
      this.imageService.getPostImage(p.id).subscribe(data => {
        p.image = data.imageBytes;
      })
    });
  }

  getCommentsToPosts(posts: Post[]) {
    posts.forEach(p => {
      this.commentService.getPostComments(p.id).subscribe(data => {
        p.comments = data;
      })
    });
  }

  likePost(postId: number, postIndex: number) {
    const post = this.posts[postIndex];
    console.log(post);

    if (!post.likedUsers.includes(this.user.username)) {
      this.postService.likePost(postId, this.user.username)
        .subscribe(() => {
          post.likedUsers.push(this.user.username);
          this.notificationService.showSnackBar('Liked!');
        });
    } else {
      this.postService.likePost(postId, this.user.username)
        .subscribe(() => {
          const index = post.likedUsers.indexOf(this.user.username, 0);
          if (index > -1) {
            post.likedUsers.splice(index, 1);
          }
        });
    }
  }

  postComment(message: string, postId: number, postIndex: number) {
    const post = this.posts[postIndex];

    console.log(post);
    this.commentService.addCommentToPost(postId, message)
      .subscribe(data => {
        console.log(data);
        post.comments.push(data);
      });
  }

  formatImage(img: any): any {
    if (img == null) {
      return null;
    }
    return 'data:image/jpeg;base64,' + img;
  }
}
