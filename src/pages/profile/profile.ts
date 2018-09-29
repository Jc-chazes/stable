import {Component} from '@angular/core';
import {NavController, LoadingController, Loading, AlertController, ToastController} from 'ionic-angular';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {EditProfilePage} from "../edit-profile/edit-profile";
import {UserService} from "../../services/user.service";
import {GoogleAnalytics} from "@ionic-native/google-analytics";

@Component({
    selector: 'page-profile',
    templateUrl: 'profile.html'
})
export class ProfilePage {

    loading: Loading;
    user : any;
    imgData:any;

    varPhoto : any;

    constructor(
        public camera: Camera,
        public navCtrl: NavController,
        public alertCtrl: AlertController,
        public loadingCtrl: LoadingController,
        public toastCtrl: ToastController,
        private userService: UserService,
        public ga: GoogleAnalytics) {}

    ionViewDidEnter(){
        this.ga.startTrackerWithId('UA-76827860-8')
            .then(() => {
                console.log('Google analytics is ready now');
                this.ga.trackView('profilePage');
            })
            .catch(e => console.log('Error starting GoogleAnalytics', e));
    }

    getDataUser(){
        this.userService.getUser()
            .subscribe(
                success =>{
                    this.user = success[0];

                    //SET PHOTO
                    this.varPhoto = this.user.photo;
                    if (this.user.photo === null || this.user.photo === "") {
                        this.user.photo = "assets/images/user.png";
                    }
                    else {
                        this.user.photo =  this.user.photo + '?r='+ Math.random();
                    }

                    //SET GENDER
                    if(this.user.gender === "F" || this.user.gender === "f"){
                        this.user.gender = "Mujer";
                    }
                    else if(this.user.gender === "M" || this.user.gender === "m"){
                        this.user.gender = "Hombre";
                    }
                    else{
                        this.user.gender = "-";
                    }
                },
                error =>{
                    console.log('ERROR', error);
                }
            );
    }

    ionViewWillEnter(){
        this.getDataUser();
    }

    deletePhoto() {
        this.showLoading();
        this.userService.deletePhoto(this.user.id)
            .subscribe(
                success => {
                    this.loading.dismiss();
                    this.user.photo = 'assets/images/user.png';
                    const toast = this.toastCtrl.create({
                        message: 'Foto de perfil eliminada',
                        duration: 2000,
                        position: 'middle'
                    });
                    toast.present();
                },
                error => {
                    this.loading.dismiss();
                    const alert = this.alertCtrl.create({
                        title: 'Ups!',
                        message: error.error,
                        buttons: ['Ok']
                    });
                    alert.present();
                }
            );
    }

    changePhoto(){
        let alert = this.alertCtrl.create({
            title: 'Cambiar foto de perfil',
            buttons: [
                {
                    text: 'Eliminar foto',
                    handler: () => {
                        this.deletePhoto();
                    }
                },
                {
                    text: 'Abrir mi galería',
                    handler: () => {
                        this.selectedGallery();
                    }
                },
                {
                    text: 'Usar cámara',
                    handler: () => {
                        this.selectedCamera();
                    }
                }
            ]
        });
        alert.present();
    }

    selectedCamera(){
        let opt : CameraOptions = {
            quality: 100,
            targetWidth: 400,
            targetHeight: 400,
            sourceType: this.camera.PictureSourceType.CAMERA,
            destinationType: this.camera.DestinationType.DATA_URL,
            mediaType: this.camera.MediaType.PICTURE,
            allowEdit: true,
            correctOrientation: true,
            encodingType: this.camera.EncodingType.JPEG,
            saveToPhotoAlbum: true
        };

        this.camera.getPicture(opt).then(
            (imageData) => {
                this.imgData = imageData;
                this.savePhotoUser();
            }, (error) => {
                //manejar error
                console.log('ERROR', error);
            }
        )
    }

    selectedGallery(){
        let options : CameraOptions = {
            quality: 100,
            targetWidth: 400,
            targetHeight: 400,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            destinationType: this.camera.DestinationType.DATA_URL,
            mediaType: this.camera.MediaType.PICTURE,
            allowEdit: true,
            correctOrientation: true,
            encodingType: this.camera.EncodingType.JPEG,
            saveToPhotoAlbum: true
        };
        this.camera.getPicture(options).then(
            (imageData) => {
                this.imgData = imageData;
                this.savePhotoUser();
            }, (error) => {
                //manejar error
                console.log('ERROR', error);

            }
        )
    }

    savePhotoUser() {
        this.showLoading();

        this.userService.updatePhoto(this.imgData)
            .subscribe(
                success =>{
                    this.camera.cleanup();
                    this.user.photo = success.imgProfile + '?r='+ Math.random();
                    this.loading.dismiss();

                    const toast = this.toastCtrl.create({
                        message: 'Foto de perfil actualizada',
                        duration: 2000,
                        position: 'middle'
                    });
                    toast.present();
                },
                error =>{
                    this.loading.dismiss();
                    const alert = this.alertCtrl.create({
                        title: 'Ups!',
                        message: error,
                        buttons: ['Ok']
                    });
                    alert.present();
                }
            );
    }

    showLoading() {
        this.loading = this.loadingCtrl.create({
            content: 'Un momento...'
        });
        this.loading.present();
    }

    showEditProfile(){
        this.userService.photoUser = this.varPhoto;
        this.navCtrl.push(EditProfilePage);
    }


}
