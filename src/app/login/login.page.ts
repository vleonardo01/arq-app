import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  async onLogin() {
    // Validar campos vacíos
    if (!this.email || !this.password) {
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'Por favor, completa todos los campos.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(this.email, this.password);
      console.log('Logged in:', userCredential);

      // Redirigir a la página de perfil después del inicio de sesión exitoso
      this.router.navigate(['/profile']);
    } catch (error) {
      const alert = await this.alertCtrl.create({
        header: 'Inicio de Sesión Fallido',
        message: (error as { message: string }).message || 'Por favor, verifica tus credenciales de inicio de sesión.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }
}
