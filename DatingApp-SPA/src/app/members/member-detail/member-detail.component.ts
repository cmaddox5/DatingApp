import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { ActivatedRoute } from '@angular/router';
import {
    NgxGalleryOptions,
    NgxGalleryImage,
    NgxGalleryAnimation
} from 'ngx-gallery';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
    selector: 'app-member-detail',
    templateUrl: './member-detail.component.html',
    styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
    user: User;
    galleryOptions: NgxGalleryOptions[];
    galleryImages: NgxGalleryImage[];

    constructor(
        private route: ActivatedRoute,
        private userService: UserService,
        private authService: AuthService,
        private alertify: AlertifyService
    ) {}

    ngOnInit() {
        this.route.data.subscribe(data => {
            this.user = data['user'];
        });

        this.galleryOptions = [
            {
                width: '500px',
                height: '500px',
                imagePercent: 100,
                thumbnailsColumns: 4,
                imageAnimation: NgxGalleryAnimation.Slide,
                preview: false
            }
        ];

        this.galleryImages = this.getImages();
    }

    getImages() {
        const imageUrls = [];
        for (let i = 0; i < this.user.photos.length; i++) {
            imageUrls.push({
                small: this.user.photos[i].url,
                medium: this.user.photos[i].url,
                big: this.user.photos[i].url,
                description: this.user.photos[i].description
            });
        }

        return imageUrls;
    }

    sendLike(id: number) {
        this.userService
            .sendLike(this.authService.decodedToken.nameid, id)
            .subscribe(
                () => {
                    this.alertify.success(
                        'You have liked: ' + this.user.knownAs
                    );
                },
                error => {
                    this.alertify.error(error);
                }
            );
    }
}
