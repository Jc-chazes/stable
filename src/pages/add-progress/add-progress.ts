import { Component } from '@angular/core';
import { NavController, Loading, LoadingController, AlertController } from 'ionic-angular';
import { MeasurementsService } from '../../services/measurements.service';
import { AuthService } from '../../services/auth.service';
import { ProgressService } from '../../services/progress.service';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { PhysicalProgressPage } from '../physical-progress/physical-progress';
import { Camera, CameraOptions } from '@ionic-native/camera';

@Component({
  selector: 'page-add-progress',
  templateUrl: 'add-progress.html'
})
export class AddProgressPage {
  loading: Loading;
  progressDate: any;
  listMeasurements: any[] = [];
  customValues: any[] = [];
  imgData: any;
  statusUploadPhoto = false;

  constructor(
    public camera: Camera,
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private authService: AuthService,
    private progressService: ProgressService,
    private measurementsService: MeasurementsService,
    public ga: GoogleAnalytics
  ) {}

  ionViewDidEnter() {
    this.statusUploadPhoto = localStorage.getItem('statusUploadPhotoProgress') == 'Y';
    this.ga
      .startTrackerWithId('UA-76827860-8')
      .then(() => {
        console.log('Google analytics is ready now');
        this.ga.trackView('addProgressPage');
      })
      .catch(e => console.log('Error starting GoogleAnalytics', e));
  }

  ionViewWillEnter() {
    this.getMeasurements();
  }

  getMeasurements() {
    this.showLoading();
    this.measurementsService.getAllMeasurements().subscribe(
      response => {
        this.loading.dismiss();
        console.log('RESPONSE', response);

        for (let i of response) {
          this.customValues.push(null);
        }
        this.listMeasurements = response;
      },
      error => {
        this.loading.dismiss();
        console.log('ERROR', error);
      }
    );
  }

  setData() {
    var condition = {
      labels: '',
      values: '',
      date: '',
      userEstablishmentId: null,
      insUser: this.authService.userId,
      photo: '',
      photoName: this.authService.userId + '',
      establishmentId: this.authService.establishmentId
    };

    let listLabels = [];
    let listValues = [];

    for (let item of this.listMeasurements) {
      listLabels.push(item.id);
    }

    for (var i = 0; i < this.customValues.length; i++) {
      if (this.customValues[i] === null) {
        listValues.push(0);
      } else {
        listValues.push(this.customValues[i]);
      }
    }

    condition.labels = JSON.stringify(listLabels);
    condition.values = JSON.stringify(listValues);

    return condition;
  }

  saveValues() {
    if (this.progressDate) {
      this.showLoading();

      let jsonCondition = this.setData();
      jsonCondition.date = this.progressDate;
      jsonCondition.userEstablishmentId = this.authService.userId;
      jsonCondition.photo = this.imgData;
      jsonCondition.photoName =
        this.authService.userId +
        '' +
        new Date()
          .toLocaleString()
          .replace(/\s/g, '')
          .replace(/,/g, '')
          .replace(/:/g, '')
          .replace(/\//g, '') + '.png';

      this.progressService.create(jsonCondition).subscribe(
        response => {
          console.log('RESPONSE', response);

          this.loading.dismiss();
          let alert = this.alertCtrl.create({
            title:
              `<img src="assets/images/success.png" class="icon-booking"> <h6 class="title-booking">` +
              '¡HURRA!' +
              `</h6>`,
            message: 'Tu registro se guardó satisfactoriamente',
            buttons: [
              {
                text: 'Ok',
                handler: () => {
                  this.navCtrl.popTo(PhysicalProgressPage);
                }
              }
            ]
          });
          alert.present();
        },
        error => {
          console.log('ERROR', error);

          this.loading.dismiss();
          let alert = this.alertCtrl.create({
            title:
              `<img src="assets/images/sad-face.png" class="icon-booking"> <h6 class="title-booking">` +
              'Ups...' +
              `</h6>`,
            message: `Hubo un problema al momento de guardar tu registro`,
            buttons: ['OK']
          });
          alert.present();
        }
      );
    } else {
      let alert = this.alertCtrl.create({
        title:
          `<img src="assets/images/sad-face.png" class="icon-booking"> <h6 class="title-booking">` + 'Ups...' + `</h6>`,
        message: 'Falta seleccionar la fecha',
        buttons: ['OK']
      });
      alert.present();
    }
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      enableBackdropDismiss: false
    });
    this.loading.present();
  }

  addPhotoProgress() {
    let alert = this.alertCtrl.create({
      title: 'Adjuntar foto de progreso',
      buttons: [
        {
          text: 'Usar cámara',
          handler: () => {
            this.selectedCamera();
          }
        },
        {
          text: 'Abrir mi galería',
          handler: () => {
            this.selectedGallery();
          }
        }
      ]
    });
    alert.present();
  }

  selectedCamera() {
    let opt: CameraOptions = {
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
      imageData => {
        this.imgData = imageData;
        console.log('Cargo la imagen data');
      },
      error => {
        //manejar error
        console.log('ERROR', error);
      }
    );
  }

  selectedGallery() {
    let options: CameraOptions = {
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
      imageData => {
        this.imgData = imageData;
        console.log('Cargo la imagen data');
      },
      error => {
        //manejar error
        console.log('ERROR', error);
      }
    );
  }
}
