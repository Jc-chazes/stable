import {Component} from '@angular/core';
import {NavController, Loading, LoadingController} from 'ionic-angular';
import {ProgressDetailPage} from "../progress-detail/progress-detail";
import {ProgressService} from "../../services/progress.service";
import {GoogleAnalytics} from "@ionic-native/google-analytics";
import {AddProgressPage} from "../add-progress/add-progress";
import * as moment from 'moment';

@Component({
    selector: 'page-physical-progress',
    templateUrl: 'physical-progress.html'
})
export class PhysicalProgressPage {

    loading: Loading;

    chartOk: boolean = false;

    listMeasurements : any[] = [];
    measurementSelected : any;

    arrProgress : any[];
    arrRecords : any[];
    thereAreProgress : boolean;

    statusRegister: string = "";

    // lineChart
    public lineChartData:Array<any> = [];
    public lineChartLabels:Array<any> = [];
    public lineChartOptions:any = {
        responsive: true,
        legend: {
            display: false,
        }
    };
    public lineChartColors:Array<any> = [
        { // grey
            backgroundColor: 'rgba(148,159,177,0.2)',
            borderColor: 'rgba(148,159,177,1)',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        }
    ];
    public lineChartType:string = 'line';

    constructor(
        public navCtrl: NavController,
        public loadingCtrl: LoadingController,
        private progressService: ProgressService,
        public ga: GoogleAnalytics) {}

    ionViewDidEnter(){
        this.ga.startTrackerWithId('UA-76827860-8')
            .then(() => {
                console.log('Google analytics is ready now');
                this.ga.trackView('physicalProgressPage');
            })
            .catch(e => console.log('Error starting GoogleAnalytics', e));
    }

    setDataProgress(){
        this.showLoading();
        this.progressService.getPhysicalProgress()
            .subscribe(
                success =>{
                    let data = success;

                    if(data.length > 0){
                        let arrSetData = [];

                        for(let j = 0; j < data.length; j++){
                            let arrLabels = data[0].labels.split(',').reverse();
                            let arrLabelsId = JSON.parse(data[0].labelsIds).reverse();
                            let arrValues = JSON.parse(data[j].values).reverse();
                            let arrUnits = data[0].units.split(',').reverse();

                            let arrData = [];

                            for(let i = 0; i < arrLabels.length; i++){
                                let item = {
                                    label: arrLabels[i],
                                    labelId: arrLabelsId[i],
                                    value: arrValues[i],
                                    unit: arrUnits[i]
                                };
                                arrData.push(item);
                            }

                            let objItem = {
                                id: data[j].id,
                                date: moment(data[j].date).format('DD/MM/YYYY'),
                                data: arrData,
                                insUser: data[j].insUser,
                                photo: data[j].photo
                            };
                            arrSetData.push(objItem);
                        }

                        arrSetData.sort(
                            (a, b) => {
                                var aDate = moment(a.date, 'DD/MM/YYYY');
                                var bDate = moment(b.date, 'DD/MM/YYYY');

                                if (aDate.isBefore(bDate)) {
                                    return -1;
                                }

                                if (aDate.isAfter(bDate)) {
                                    return 1;
                                }

                                return 0;
                            }
                        );

                        this.arrProgress = arrSetData;
                        this.arrRecords = arrSetData;

                        this.thereAreProgress = true;

                        this.loading.dismiss();
                        this.setDataSelect();
                    }
                    else{
                        this.loading.dismiss();
                        this.thereAreProgress = false;
                    }
                },
                error =>{
                    this.loading.dismiss();
                    let err = error.json();
                    console.log('ERROR-CONDICIONES', err);
                    this.thereAreProgress = false;
                }
            )
    }

    setDataSelect(){
        let selectData = [];

        for(let k = 0; k < this.arrProgress.length; k++){

            for(let l = 0; l < this.arrProgress[k].data.length; l++){
                let item = {
                    labelId: 0,
                    label : "",
                    value : [],
                    dates : [],
                };

                if(k == 0){
                    item.labelId = this.arrProgress[k].data[l].labelId;
                    item.label = this.arrProgress[k].data[l].label;
                    item.value.push(this.arrProgress[k].data[l].value);
                    item.dates.push(this.arrProgress[k].date);
                    selectData.push(item);
                }
                else if(k > 0) {
                    if (selectData[l].label == this.arrProgress[k].data[l].label) {
                        selectData[l].value.push(this.arrProgress[k].data[l].value);
                        selectData[l].dates.push(this.arrProgress[k].date);
                    }
                }
            }
        }

        this.listMeasurements = selectData;
        this.measurementSelected = this.listMeasurements[0].labelId;
        this.renderGraphic();
    }

    renderGraphic(){
        this.chartOk =  false;
        this.lineChartData = [];
        this.lineChartLabels = [];

        let listValues = [];
        let listLabels = [];
        let listDates = [];

        for(let a = 0; a < this.listMeasurements.length; a++){

            if(this.measurementSelected == this.listMeasurements[a].labelId){
                for(let b = 0; b < this.listMeasurements[a].value.length; b++){

                    listValues.push(this.listMeasurements[a].value[b]);
                    listLabels.push(this.listMeasurements[a].label[b]);
                    listDates.push(this.listMeasurements[a].dates[b]);

                }

            }
        }

        let dataValues = [{data: listValues, label: listLabels}];

        this.lineChartLabels = listDates;
        this.lineChartData = dataValues;
        this.chartOk = true;
    }

    ionViewWillEnter(){
        this.statusRegister = localStorage.getItem('statusPhysicalConditionsRegister');
        this.setDataProgress();
    }

    showLoading() {
        this.loading = this.loadingCtrl.create({
            enableBackdropDismiss: false
        });
        this.loading.present();
    }

    viewRecordDetail(record){
        this.progressService.progressDetail = record;
        this.navCtrl.push(ProgressDetailPage);
    }

    addProgress(){
        this.navCtrl.push(AddProgressPage);
    }

    ionViewDidLeave(){
        this.chartOk = false;
    }

}
