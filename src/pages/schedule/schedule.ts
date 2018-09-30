import { Component, ViewChild } from '@angular/core';
import { NavController, LoadingController, Loading, AlertController, Content } from 'ionic-angular';
import { LessonDetailPage } from '../lesson-detail/lesson-detail';
import { ReservesPage } from '../reserves/reserves';
import { LessonsService } from '../../services/lessons.service';
import { ReservesService } from '../../services/reserves.service';
import { DisciplinesService } from '../../services/disciplines.service';
import { PersonalService } from '../../services/personal.service';
import { RoomsService } from '../../services/rooms.service';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { AuthService } from '../../services/auth.service';
import { EstablishmentsService } from '../../services/establishments.service';
import * as moment from 'moment';
import { ShopPage } from '../shop/shop';
import { App } from 'ionic-angular';

@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html'
})
export class SchedulePage {
  @ViewChild(Content) content: Content;
  loading: Loading;
  statusWaitingList = false;

  today = new Date();
  numday = this.today.getDate();
  nummonth = this.today.getMonth();

  week = [
    { number: null, letter: null, month: null, monthNumber: null, date: null },
    { number: null, letter: null, month: null, monthNumber: null, date: null },
    { number: null, letter: null, month: null, monthNumber: null, date: null },
    { number: null, letter: null, month: null, monthNumber: null, date: null },
    { number: null, letter: null, month: null, monthNumber: null, date: null },
    { number: null, letter: null, month: null, monthNumber: null, date: null },
    { number: null, letter: null, month: null, monthNumber: null, date: null }
  ];
  monthName: string;

  contWeek = 0;
  varDate = new Date();

  lessons: any[];
  thereAreLessons: boolean = true;

  divFilter: boolean = false;
  dataToFilter: any[];

  disciplineIdSelected: any = '';
  instructorIdSelected: any = '';
  roomIdSelected: any = '';
  establishmentIdSelected: any = '';

  selectDisciplines: any[];
  selectInstructors: any[];
  selectRooms: any[];
  selectEstablishments: any[];
  establishmentId: number = this.authService.establishmentId;

  /**/
  statusBooking: string;
  segment: string = 'lessons';
  selectedSearch: boolean = false;
  listServices: any = [];
  service: any = {};
  availableSchedule: any = [];
  shareBD: boolean ;
  orgEstablishments;

  constructor(
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private lessonsService: LessonsService,
    private reservesService: ReservesService,
    private disciplinesService: DisciplinesService,
    private personalService: PersonalService,
    private roomsService: RoomsService,
    private establishmentsService: EstablishmentsService,
    public ga: GoogleAnalytics,
    private authService: AuthService,
    private app: App
  ) {
    this.getListServices();
  }

  ionViewDidEnter() {
    this.ga
      .startTrackerWithId('UA-76827860-8')
      .then(() => {
        console.log('Google analytics is ready now');
        this.ga.trackView('schedulePage');
      })
      .catch(e => console.log('Error starting GoogleAnalytics', e));
  }

  /*RENDER CALENDAR AND LESSONS*/

  renderWeek(date) {
    let days = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
    let months = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre'
    ];
    let offset = -3;

    for (let i = 0; i <= 6; i++) {
      let paintDay = moment(date).add(offset, 'days');
      let paintName = paintDay.day();

      this.week[i].date = paintDay.toDate();
      this.week[i].number = paintDay.date();
      this.week[i].letter = days[paintName];
      this.week[i].monthNumber = paintDay.month();
      this.week[i].month = months[paintDay.month()];

      offset++;
    }

    this.monthName = this.week[3].month;

    this.lessons = [];
    this.availableSchedule = [];
    this.renderLessons(this.week[3].date);

    return this.week;
  }

  selectedDay(date) {
    this.renderWeek(date);
  }

  renderPrevWeek() {
    if (this.contWeek > 0) {
      this.varDate.setDate(this.varDate.getDate() - 7);
      this.renderWeek(this.varDate);
      this.contWeek--;
    } else if (this.contWeek < 0) {
      this.contWeek = 0;
    }
  }

  renderNextWeek() {
    this.varDate.setDate(this.varDate.getDate() + 7);
    this.renderWeek(this.varDate);

    this.contWeek++;
  }

  resetWeek() {
    let today = moment();
    this.renderWeek(today);
  }

  renderLessons(date) {
    let dateFormat = moment(date).format('YYYY-MM-DD');

    if (this.segment == 'lessons') {
      this.showLoading();
      this.lessonsService.getLessonsByDate(dateFormat, this.establishmentId).subscribe(
        data => {
          if (data.length > 0) {
            this.setResponseData(data);
          } else {
            this.thereAreLessons = false;
          }
          this.loading.dismiss();
        },
        error => {
          this.loading.dismiss();
          this.thereAreLessons = false;

          let alert = this.alertCtrl.create({
            title: '¡Ups!',
            subTitle: 'Hubo un problema de conexión',
            buttons: ['OK']
          });
          alert.present();
        }
      );
    } else {
      if (this.service.id) {
        this.showLoading();
        this.lessonsService.getShowtimesAvailables(dateFormat, this.service.id).subscribe(
          success => {
            this.setResponseData(success);
            this.loading.dismiss();
          },
          error => {
            this.loading.dismiss();
            let err = error.json();

            let alert: any;
            let message = '';

            switch (err.title) {
              case 'GLOBAL.ERROR_TITULO':
                message = 'Hmm algo anda mal. Parece que hay problemas de conexión a internet.';
                alert = this.alertCtrl.create({
                  title:
                    `<img src="assets/images/sad-face.png" class="icon-booking"> <h6 class="title-booking">` +
                    'No se pudo realizar la reserva' +
                    `</h6>`,
                  subTitle: message,
                  buttons: ['OK']
                });
                alert.present();
                break;
              case 'ERROR_DB_BODY':
                message = 'Hmm algo anda mal. Parece que hay problemas de conexión a internet.';
                alert = this.alertCtrl.create({
                  title:
                    `<img src="assets/images/sad-face.png" class="icon-booking"> <h6 class="title-booking">` +
                    'No se pudo realizar la reserva' +
                    `</h6>`,
                  subTitle: message,
                  buttons: ['OK']
                });
                alert.present();
                break;
            }
          }
        );
      }
    }
  }

  setResponseData(data) {
    let temp = [];

    //Validación para mostrar las clases a partir de esta hora en adelante
    if (moment(this.week[3].date).format('DD/MM/YYYY') == moment().format('DD/MM/YYYY')) {
      temp = [];
      for (let item of data) {
        item.date = moment(item.start).format('DD/MM/YYYY');
        item.start = moment(item.start).format('hh:mm a');
        item.end = moment(item.end).format('hh:mm a');

        let currentHour = moment().format();
        let lessonHour = moment(item.start, 'hh:mm a').format();

        if (lessonHour >= currentHour) {
          temp.push(item);
        }
      }
    } else if (moment(this.week[3].date).format() >= moment().format()) {
      temp = [];
      for (let item of data) {
        item.date = moment(item.start).format('DD/MM/YYYY');
        item.start = moment(item.start).format('hh:mm a');
        item.end = moment(item.end).format('hh:mm a');
        temp.push(item);
      }
    }

    if (temp.length > 0) {
      temp.sort((a, b) => {
        var aDate = moment(a.start, 'hh:mm a');
        var bDate = moment(b.start, 'hh:mm a');

        if (aDate.isBefore(bDate)) {
          return -1;
        }

        if (aDate.isAfter(bDate)) {
          return 1;
        }

        return 0;
      });

      if (this.segment == 'lessons') {
        //Filtrar para mostrar las clases en las que no estoy reservada.
        let lessonsReserved = temp[0].lessonRecordsBookings ? temp[0].lessonRecordsBookings.split(',') : [];
        let lessonsFiltered = temp.filter(item => {
          return lessonsReserved.indexOf(item.id + '') > -1 ? false : true;
        });

        this.dataToFilter = lessonsFiltered;
        this.aplyFilter();
      } else {
        // armar codigo para los servicios
        this.availableSchedule = temp;
      }
    } else {
      this.thereAreLessons = false;
    }
  }

  /*VIEW WILL ENTER - VIEW WILL LEAVE*/

  ionViewWillEnter() {
    this.establishmentIdSelected = localStorage.getItem('establishmentSelected');
    this.statusBooking = localStorage.getItem('statusSchedule');
    this.statusWaitingList = localStorage.getItem('statusWaitingList') == 'Y';
    this.shareBD = localStorage.getItem('statusShareBD') == 'Y' ? true : false;

    this.renderWeek(this.today);
    this.getRequirements();
    this.getCurrencyCode();
    this.scrollToTop();
  }

  ionViewWillLeave() {
    this.divFilter = false;
  }

  /*CREATE RESERVE(S)*/

  showSimpleRerserveAlert(lesson, waintingList?) {
    let messageAlert = lesson.disciplineName + ' a las ' + lesson.start + ' el ' + lesson.date;

    let alert;

    if (waintingList) {
      alert = this.alertCtrl.create({
        title: `<img src="assets/images/booking.png" class="icon-booking">
                      <p class="title-booking">
                      ¿QUIERES ENTRAR EN LISTA DE ESPERA?
                      </p>`,
        message: messageAlert,
        buttons: [
          {
            text: 'CONFIRMAR',
            handler: () => {
              this.doSimpleReserve(lesson);
            }
          }
        ]
      });
    } else {
      alert = this.alertCtrl.create({
        title: `<img src="assets/images/booking.png" class="icon-booking">
                      <p class="title-booking">
                      ¿QUIERES RESERVAR UN CUPO?
                      </p>`,
        message: messageAlert,
        buttons: [
          {
            text: 'RESERVA RECURRENTE',
            handler: () => {
              this.showMultipleReserveAlert(lesson);
            }
          },
          {
            text: 'CONFIRMAR',
            handler: () => {
              this.doSimpleReserve(lesson);
            }
          }
        ]
      });
    }
    alert.present();
  }

  showMultipleReserveAlert(lesson) {
    let numberDay = moment(lesson.date, 'DD/MM/YYYY').day();
    let arrDays = ['domingos', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sábados'];

    let alert = this.alertCtrl.create({
      title: `<img src="assets/images/booking.png" class="icon-booking">`,
      message:
        'Elige cuantas sesiones deseas reservar en la clase de ' +
        lesson.disciplineName +
        ' los ' +
        arrDays[numberDay] +
        ' a las ' +
        lesson.start,
      inputs: [
        {
          name: 'cantSessions',
          placeholder: 'N° Sesiones',
          type: 'number'
        }
      ],
      buttons: [
        { text: 'Cancelar' },
        {
          text: 'Confirmar',
          handler: data => {
            let info = {
              sessions: data.cantSessions
            };
            this.doMultipleReserve(info, lesson);
          }
        }
      ]
    });
    alert.present();
  }

  doSimpleReserve(lesson) {
    this.showLoading();

    this.reservesService.createReserve(lesson.id).subscribe(
      success => {
        this.loading.dismiss();
        this.successReserve('¡HURRA!', 'Tu reserva se realizó satisfactoriamente');

        this.ga
          .startTrackerWithId('UA-76827860-8')
          .then(() => {
            console.log('Google analytics is ready now');
            this.ga.trackEvent(
              'Reservas',
              'crear',
              this.authService.userLogged.establishmentName +
                ' / ' +
                this.authService.establishmentId +
                ' / ' +
                lesson.disciplineName,
              1
            );
          })
          .catch(e => console.log('Error starting GoogleAnalytics', e));
      },
      error => {
        this.loading.dismiss();

        let err = error.json();
        let message = '';

        switch (err.title) {
          case 'RESERVES.ERROR_MEMBERSHIPS':
            message = 'Uy... no cuentas con una membresía activa para esta disciplina';
            break;
          case 'RESERVES.ERROR_RESERVES':
            message = 'El cliente ya cuenta con una reserva';
            break;
          case 'RESERVES.ERROR_CLOSED':
            message = 'La clase se encuentra dictada';
            break;
          case 'RESERVES.ERROR_OCCUPANCY':
            message = 'Uy... ya no quedan cupos disponibles. Prueba con otra clase por favor';
            break;
          case 'ERROR_LIMIT_RESERVE':
            message =
              'Uy... tu centro no te permite realizar una reserva para esta clase. Por favor contáctate con ellos para que puedan ayudarte.';
            break;
          case 'RESERVES.ERROR_SESSIONS':
            message =
              'Uy... ya consumiste todas las sesiones disponibles de tu membresía. Contáctate con tu centro para que puedas comprar más';
            break;
          case 'RESERVES.ERROR_SESSION_LESSON':
            message =
              'Uy... ya consumiste todas las sesiones disponibles para esta disciplina. Contáctate con tu centro para que puedas comprar más';
            break;
          case 'RESERVES.ERROR_DATES':
            message =
              'Uy... tu membresía ya venció. Contáctate con tu centro para que puedas comprar tu siguiente membresía';
            break;
          case 'RESERVES.ERROR_DISCIPLINES':
            message =
              'Uy... tu membresía no cuenta con esta disciplina. Si deseas poder ingresar acercate a tu centro y compra una membresía con esta disciplina asociada';
            break;
          case 'ERROR_DB_BODY':
            message = 'Uy... hubo un problema de conexión. Por favor inténtalo nuevamente';
            break;
          case 'RESERVES.ERROR_LIMIT_TIME_PREV':
              var label =  err.type == '0' ?  ' Día(s)' : err.type == '1' ? ' Hora(s)' : ' Minuto(s)' ;
              message = 'Su categoria de cliente asociada permite realizar reservas con un tiempo previo de ' + err.time + label
              break;
          case 'RESERVES.ERROR_LIMIT_DAYS_MAX':
            message = 'Su categoria de cliente asociada le permite ' + err.days + ' día(s) libres para reservar ';
            break;
          case 'RESERVES.ERROR_LOGINONSITE_LIMIT_REACHED':
            message = 'Se ha alcanzado el límite de reservas para su membresía adquirida bajo la modalidad de pago presencial.'
            break;
        }

        if (err.title == 'WAINTING.LIST.ADDED') {
          let pos = 1;
          const waitingList = err.listWaitingList;
          for (const posw in waitingList) {
            if (this.authService.userId == waitingList[posw].userEstablishmentId) {
              pos = parseInt(posw) + 1;
            }
          }
          let alert = this.alertCtrl.create({
            title:
              `<img src="assets/images/happy-face.png" class="icon-booking"> <h6 class="title-booking">` +
              '¡Éxito! entraste en la lista de espera' +
              `</h6>`,
            subTitle: `${
              pos == 1 ? 'Eres el primero de la lista de espera' : `Hay ${pos} persona(s) antes que tu`
            }, te notificaremos en caso de liberarse un espacio para ti`,
            buttons: ['OK']
          });
          alert.present();
        } else {
          let alert = this.alertCtrl.create({
            title:
              `<img src="assets/images/sad-face.png" class="icon-booking"> <h6 class="title-booking">` +
              'No se pudo realizar la reserva' +
              `</h6>`,
            subTitle: message,
            buttons: ['OK']
          });
          if( err.title == 'RESERVES.ERROR_MEMBERSHIPS' ){
            alert.addButton({
              text: 'Ir a comprar membresía',
              handler: ()=>{
                this.navCtrl.parent.select(1);
              }
            });
          }
          alert.present();
        }
      }
    );
  }

  doMultipleReserve(info, lesson) {
    this.showLoading();

    let hour = moment(lesson.start, 'hh:mm a').format('HH:mm:ss');
    let start = moment(lesson.date, 'DD/MM/YYYY').format('YYYY-MM-DD');

    let data = {
      time: hour,
      startDate: start,
      endDate: null,
      sessions: info.sessions,
      userEstablishment: this.authService.userId,
      lessonId: lesson.lessonId
    };

    this.reservesService.createMultipleReserves(data, lesson.id).subscribe(
      success => {
        this.loading.dismiss();
        if (success.length > 0) {
          this.successReserve('¡HURRA!', 'Tus reservas se realizaron satisfactoriamente');

          this.ga
            .startTrackerWithId('UA-76827860-8')
            .then(() => {
              console.log('Google analytics is ready now');
              this.ga.trackEvent(
                'Reservas',
                'crear',
                this.authService.userLogged.establishmentName +
                  ' / ' +
                  this.authService.establishmentId +
                  ' / ' +
                  lesson.disciplineName,
                success.length
              );
            })
            .catch(e => console.log('Error starting GoogleAnalytics', e));
        } else {
          let alert = this.alertCtrl.create({
            title: `<h6 class="title-booking">` + 'No se pudieron crear las reservas' + `</h6>`,
            message: 'Por favor revisa si tienes sesiones disponibles y si existen las clases solicitadas',
            buttons: ['OK']
          });
          alert.present();
        }
      },
      error => {
        this.loading.dismiss();
        let alert = this.alertCtrl.create({
          title:
            `<img src="assets/images/sad-face.png" class="icon-booking"><h6 class="title-booking">` + 'Uyyy' + `</h6>`,
          message: 'No se pudieron crear las reservas',
          buttons: ['OK']
        });
        alert.present();
      }
    );
  }

  successReserve(titleAlert, messageAlert) {
    let alert = this.alertCtrl.create({
      title: `<img src="assets/images/success.png"> <h6 class="title-booking">` + titleAlert + `</h6>`,
      message: messageAlert,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.navCtrl.push(ReservesPage);
          }
        }
      ]
    });
    alert.present();
  }

  /*FILTER, PAGE-RESERVES, PAGE-LESSON-DETAIL, LOADING AND REQUIREMENTS*/

  showFilter() {
    this.divFilter = true;
  }

  aplyFilter() {

    let dataFiltered = [];
    let dataModificada = this.dataToFilter;

    if (this.disciplineIdSelected) {
      dataFiltered = [];
      for (let item of dataModificada) {
        if (item.disciplineId == this.disciplineIdSelected) {
          dataFiltered.push(item);
        }
      }
      dataModificada = Object.assign([], dataFiltered);
    }
    if (this.instructorIdSelected) {
      dataFiltered = [];
      for (let item of dataModificada) {
        if (item.instructorId == this.instructorIdSelected) {
          dataFiltered.push(item);
        }
      }
      dataModificada = Object.assign([], dataFiltered);
    }
    if (this.roomIdSelected) {
      dataFiltered = [];
      for (let item of dataModificada) {
        if (item.romId == this.roomIdSelected) {
          dataFiltered.push(item);
        }
      }
      dataModificada = Object.assign([], dataFiltered);
    }

    this.closeFilter();
    this.lessons = Object.assign([], dataModificada);

    this.thereAreLessons = this.lessons.length > 0;
    this.reservesService.getWaitingListByUser(this.authService.userId).subscribe(waitingList => {
      for (const w in waitingList) {
        for (const l in dataModificada) {
          dataModificada[l]['showEsperar'] = waitingList[w].lessonRecordId == dataModificada[l].id;
        }
      }
      this.lessons = Object.assign([], dataModificada);
      this.thereAreLessons = this.lessons.length > 0;
    });
  }

  clearFilter() {
    this.disciplineIdSelected = '';
    this.instructorIdSelected = '';
    this.roomIdSelected = '';
    this.establishmentIdSelected = '';
    this.aplyFilter();
  }

  closeFilter() {
    this.divFilter = false;
  }

  goToReserves() {
    this.navCtrl.push(ReservesPage);
  }

  viewDetail(lesson) {
    lesson.type = 'discipline';
    this.lessonsService.lessonDetail = lesson;
    this.navCtrl.push(LessonDetailPage);
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      enableBackdropDismiss: false
    });
    this.loading.present();
  }

  getRequirements() {
    this.disciplinesService.getDisciplines().subscribe(response => {
      this.selectDisciplines = response;
    });

    this.personalService.getPersonal().subscribe(response => {
      const arr = [];
      for (let i of response) {
        if (i.roleId == 4) {
          arr.push(i);
        }
      }
      this.selectInstructors = arr;
    });

    this.roomsService.getRooms().subscribe(response => {
      this.selectRooms = response;
    });

    if (this.shareBD) {
      this.establishmentsService.getAll().subscribe(response => {
        this.selectEstablishments = response;
      });
    }
  }

  getCurrencyCode() {
    this.establishmentsService.getEstablishmentById().subscribe(success => {
      localStorage.setItem('currencyCode', success[0].currency);
    });
  }

  /*APPOINTMENTS*/
  resetServiceSearch() {
    this.selectedSearch = false;
    this.service = {};
  }

  getListServices() {
    this.lessonsService.getListServices(this.establishmentId).subscribe(
      response => {
        this.listServices = response;
      },
      error => {
        console.log('ERROR', error);
      }
    );
  }

  serviceSelected(item) {
    this.service = item;
    this.selectedSearch = true;
    this.renderWeek(this.today);
    this.scrollToTop();
  }

  showReserveServiceAlert(service) {
    let messageAlert = service.disciplineName + ' a las ' + service.start + ' el ' + service.date;
    let alert = this.alertCtrl.create({
      title: `<img src="assets/images/booking.png" class="icon-booking">
                    <p class="title-booking">¿QUIERES RESERVAR UN CUPO?</p>`,
      message: messageAlert,
      buttons: [
        { text: 'CANCELAR' },
        {
          text: 'CONFIRMAR',
          handler: () => {
            this.doReserveService(service);
          }
        }
      ]
    });
    alert.present();
  }

  doReserveService(service) {
    const dateLessonSer = moment(service.date + ' ' + service.start, 'DD/MM/YYYY hh:mm aa').format(
      'YYYY-MM-DD HH:mm:ss'
    );
    const buildServiceBody = {
      lessonId: service.lessonId,
      lessonRecordId: service.lessonRecordId,
      occupancy: service.occupancy,
      romId: service.romId,
      instructorId: service.instructorId,
      dateLesson: dateLessonSer,
      startTime: moment(service.start, 'hh:mm aa').format('HH:mm:ss'),
      endTime: moment(service.end, 'hh:mm aa').format('HH:mm:ss'),
      status: '0',
      userId: this.authService.userId,
      scheduleDisciplineId: service.disciplineId
    };

    this.showLoading();

    this.reservesService.createAppointment(buildServiceBody).subscribe(
      success => {
        this.loading.dismiss();
        this.successReserve('¡HURRA!', 'Tu reserva se realizó satisfactoriamente');

        this.ga
          .startTrackerWithId('UA-76827860-8')
          .then(() => {
            console.log('Google analytics is ready now');
            this.ga.trackEvent(
              'Reservas',
              'crear',
              this.authService.userLogged.establishmentName +
                ' / ' +
                this.authService.establishmentId +
                ' / ' +
                service.disciplineName,
              1
            );
          })
          .catch(e => console.log('Error starting GoogleAnalytics', e));
      },
      error => {
        this.loading.dismiss();
        let err = error.json();
        let message = '';

        switch (err.title) {
          case 'RESERVES.ERROR_MEMBERSHIPS':
            message = 'Uy... no cuentas con una membresía activa para este servicio';
            break;
          case 'RESERVES.ERROR_RESERVES':
            message = 'El cliente ya cuenta con una reserva';
            break;
          case 'RESERVES.ERROR_CLOSED':
            message = 'El servicio se encuentra dictado';
            break;
          case 'RESERVES.ERROR_OCCUPANCY':
            message = 'Uy... ya no quedan cupos disponibles. Prueba con otro servicio por favor';
            break;
          case 'ERROR_LIMIT_RESERVE':
            message =
              'Uy... tu centro no te permite realizar una reserva para este servicio. Por favor contáctate con ellos para que puedan ayudarte.';
            break;
          case 'RESERVES.ERROR_SESSIONS':
            message =
              'Uy... ya consumiste todas las sesiones disponibles de tu membresía. Contáctate con tu centro para que puedas comprar más';
            break;
          case 'RESERVES.ERROR_SESSION_LESSON':
            message =
              'Uy... ya consumiste todas las sesiones disponibles para este servicio. Contáctate con tu centro para que puedas comprar más';
            break;
          case 'RESERVES.ERROR_DATES':
            message =
              'Uy... tu membresía ya venció. Contáctate con tu centro para que puedas comprar tu siguiente membresía';
            break;
          case 'RESERVES.ERROR_DISCIPLINES':
            message =
              'Uy... tu membresía no cuenta con este servicio. Si deseas poder ingresar acercate a tu centro y compra una membresía con este  servicio asociada';
            break;
          case 'ERROR_DB_BODY':
            message = 'Uy... hubo un problema de conexión. Por favor inténtalo nuevamente';
            break;
        }

        let alert = this.alertCtrl.create({
          title:
            `<img src="assets/images/sad-face.png" class="icon-booking"> <h6 class="title-booking">` +
            'No se pudo realizar la reserva' +
            `</h6>`,
          subTitle: message,
          buttons: ['OK']
        });
        alert.present();
      }
    );
  }

  viewDetailService(service) {
    service.type = 'service';
    this.lessonsService.lessonDetail = service;
    this.navCtrl.push(LessonDetailPage);
  }

  scrollToTop() {
    this.content.scrollToTop();
  }

  onSegmentChange() {
    if (this.segment == 'lessons' || (this.segment == 'services' && this.selectedSearch)) {
      this.selectedDay(this.week[3].date);
    }
  }

  selectEstablishment() {
    this.establishmentId = this.establishmentIdSelected;
    this.disciplinesService.getDisciplines(this.establishmentIdSelected).subscribe(response => {
      this.selectDisciplines = response;
    });

    this.roomsService.getRooms(this.establishmentIdSelected).subscribe(response => {
      this.selectRooms = response;
    });


  }

  selectDiscipline() {
    if (this.disciplineIdSelected && this.disciplineIdSelected != '') {
      this.personalService.getPersonalByDiscipline(this.disciplineIdSelected).subscribe(response => {
        this.selectInstructors = response;
      });
    }
  }
}
