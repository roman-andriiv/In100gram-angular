import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Post} from "../../models/Post";
import {PostService} from "../../services/post.service";
import {ImageUploadService} from "../../services/image-upload.service";
import {NotificationService} from "../../services/notification.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit {

  postForm: FormGroup;
  selectedFile: File;
  isPostCreated: boolean = false;
  createdPost: Post;
  previewImgUrl: any;


  constructor(private postService: PostService,
              private imageService: ImageUploadService,
              private notificationService: NotificationService,
              private fb: FormBuilder,
              private route: Router) {
  }

  ngOnInit(): void {
    this.postForm = this.createPostForm();
  }

  createPostForm(): FormGroup {
    return this.fb.group({
      title: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required])],
      location: ['', Validators.compose([Validators.required])],
    });
  }

  submit() {
    this.postService.createPost({
      title: this.postForm.value.title,
      description: this.postForm.value.description,
      location: this.postForm.value.location,
    }).subscribe(data => {
      this.createdPost = data;
      console.log('Post created');
      console.log(data);

      if (this.createdPost.id != null) {
        this.imageService.uploadImageToPost(this.selectedFile, this.createdPost.id)
          .subscribe(() => {
            this.notificationService.showSnackBar('Post created successfully');
            this.isPostCreated = true;
            this.route.navigate(['/profile']);
          });
      }
    });
  }

  onFileSelected(event) {
    this.selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(this.selectedFile);
    reader.onload = (e) => {
      this.previewImgUrl = reader.result;
    };
  }
}
