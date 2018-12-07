import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

/*Views*/
import { LoginPage } from "../pages/login/login";
import { OnboardingPage } from "../pages/onboarding/onboarding";
import { SignupPage } from "../pages/signup/signup";
import { SearcherPage } from "../pages/searcher/searcher";
import { CentersPreviewPage } from "../pages/centers-preview/centers-preview";
import { TabsPage } from '../pages/tabs/tabs';
import { SchedulePage } from "../pages/schedule/schedule";
import { ShopPage } from "../pages/shop/shop";
import { HomePage } from '../pages/home/home';
import { ManagmentPage } from "../pages/managment/managment";
import { NotificationsPage } from '../pages/notifications/notifications';
import { LessonDetailPage } from "../pages/lesson-detail/lesson-detail";
import { PlanDetailPage } from "../pages/plan-detail/plan-detail";
import { ProductDetailPage } from "../pages/product-detail/product-detail";
import { FormPersonalDataPage } from "../pages/form-personal-data/form-personal-data";
import { FormCardDataPage } from "../pages/form-card-data/form-card-data";
import { PhysicalProgressPage } from "../pages/physical-progress/physical-progress";
import { ProgressDetailPage } from "../pages/progress-detail/progress-detail";
import { MembershipsPage } from "../pages/memberships/memberships";
import { MembershipDetailPage } from "../pages/membership-detail/membership-detail";
import { MembershipPaymentsPage } from "../pages/membership-payments/membership-payments";
import { MembershipFreezesPage } from "../pages/membership-freezes/membership-freezes";
import { MembershipAttendancesPage } from "../pages/membership-attendances/membership-attendances";
import { ReservesPage } from "../pages/reserves/reserves";
import { UnpaidsPage } from "../pages/unpaids/unpaids";
import { ReserveDetailPage } from "../pages/reserve-detail/reserve-detail";
import { ProductsPage } from "../pages/products/products";
import { DebtsPage } from "../pages/debts/debts";
import { ProfilePage } from "../pages/profile/profile";
import { EditProfilePage } from "../pages/edit-profile/edit-profile";
import { SettingsPage } from "../pages/settings/settings";
import { PasswordPage } from "../pages/password/password";
import { AddProgressPage } from "../pages/add-progress/add-progress";
import { QrCodePage } from "../pages/qr-code/qr-code";

/*Services*/
import { AppService } from "../services/app.service";
import { AuthService } from "../services/auth.service";
import { LessonsService } from "../services/lessons.service";
import { ReservesService } from "../services/reserves.service";
import { PlansService } from "../services/plans.service";
import { DisciplinesService } from "../services/disciplines.service";
import { PersonalService } from "../services/personal.service";
import { RoomsService } from "../services/rooms.service";
import { CulqiService } from "../services/culqi.service";
import { PayUService } from "../services/payu.service";
import { ProgressService } from "../services/progress.service";
import { UserService } from "../services/user.service";
import { MembershipsService } from "../services/memberships.service";
import { AttendancesService } from "../services/attendances.service";
import { PaymentsService } from "../services/payments.service";
import { FreezesService } from "../services/freezes.service";
import { ProductsService } from "../services/products.service";
import { DebtsService } from "../services/debts.service";
import { EstablishmentsService } from "../services/establishments.service";
import { NotificationsService } from "../services/notifications.service";
import { MeasurementsService } from "../services/measurements.service";
import { ValidationService } from '../services/validation.service';

/*Tools*/
import { HttpModule } from '@angular/http';
import { ChartsModule } from 'ng2-charts';
import { Push } from '@ionic-native/push';
import { Camera } from '@ionic-native/camera';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { AppStateService } from '../services/app-state.service';
import { Firebase } from '@ionic-native/firebase';
import { Device } from '@ionic-native/device';

/*Observable extensions*/
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';
import { DevicesService } from '../services/devices.service';
import { NavigationService } from '../services/navigation.service';
import { CommunicationsPage } from '../pages/communications/communications';
import {CommunicationsService} from "../services/communications.service";

@NgModule({
    declarations: [
        MyApp,
        LoginPage,
        OnboardingPage,
        CentersPreviewPage,
        SchedulePage,
        ShopPage,
        ManagmentPage,
        NotificationsPage,
        MembershipsPage,
        ReservesPage,
        UnpaidsPage,
        ProductsPage,
        DebtsPage,
        MembershipDetailPage,
        MembershipPaymentsPage,
        MembershipAttendancesPage,
        MembershipFreezesPage,
        ReserveDetailPage,
       CommunicationsPage,
        LessonDetailPage,
        PlanDetailPage,
        ProductDetailPage,
        FormPersonalDataPage,
        FormCardDataPage,
        PhysicalProgressPage,
        ProgressDetailPage,
        AddProgressPage,
        SettingsPage,
        ProfilePage,
        EditProfilePage,
        PasswordPage,
        SearcherPage,
        SignupPage,
        HomePage,
        QrCodePage,
        TabsPage,

    ],
    imports: [
        BrowserModule,
        HttpModule,
        ChartsModule,
        NgxQRCodeModule,
        IonicModule.forRoot(MyApp)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        LoginPage,
        OnboardingPage,
        CentersPreviewPage,
        SchedulePage,
        ShopPage,
        ManagmentPage,
        NotificationsPage,
        MembershipsPage,
        ReservesPage,
        UnpaidsPage,
        ProductsPage,
        DebtsPage,
        MembershipDetailPage,
        MembershipPaymentsPage,
        MembershipAttendancesPage,
        MembershipFreezesPage,
        ReserveDetailPage,
        LessonDetailPage,
        PlanDetailPage,
        ProductDetailPage,
        FormPersonalDataPage,
        FormCardDataPage,
        PhysicalProgressPage,
        ProgressDetailPage,
        AddProgressPage,
        SettingsPage,
        ProfilePage,
        EditProfilePage,
        PasswordPage,
        SearcherPage,
        SignupPage,
        HomePage,
        QrCodePage,
        TabsPage,
        CommunicationsPage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        Camera,
        GoogleAnalytics,
        LocalNotifications,
        Push,
        AppService,
        AuthService,
        LessonsService,
        ReservesService,
        PlansService,
        DisciplinesService,
        PersonalService,
        RoomsService,
        CulqiService,
        PayUService,
        ProgressService,
        UserService,
        MembershipsService,
        AttendancesService,
        PaymentsService,
        FreezesService,
        ProductsService,
        DebtsService,
        EstablishmentsService,
        NotificationsService,
        MeasurementsService,
        BarcodeScanner,
        ValidationService,
        CommunicationsService,
        { provide: ErrorHandler, useClass: IonicErrorHandler },
        AppStateService,
        DevicesService,
        Firebase,
        Device,
        NavigationService
    ]
})
export class AppModule {
}
