import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {
  name: string = '';
  email: string = '';
  password: string = '';
  subscription: Subscription | undefined;  // Variable to store the subscription

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUserData();
  }

  // Unsubscribe from the Firebase listener when the component is destroyed
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // Load current user data from Firebase
  async loadUserData() {
    const user = await this.afAuth.currentUser;
    if (user) {
      this.email = user.email || '';

      // Subscribe to user data from Firebase Realtime Database
      this.subscription = this.db.object(`/users/${user.uid}`).valueChanges()
        .subscribe((userData: any) => {
          if (userData) {
            this.name = userData.name || '';
          }
        });
    }
  }

  // Update user profile information
  async updateProfile() {
    const user = await this.afAuth.currentUser;
    if (user) {
      try {
        // Update the user's display name in Firebase Authentication
        await user.updateProfile({
          displayName: this.name,
        });

        // Optionally update password if the user has entered a new one
        if (this.password) {
          await user.updatePassword(this.password);
        }

        // Update the user's name in Firebase Realtime Database
        await this.db.object(`/users/${user.uid}`).update({
          name: this.name,
        });

        const alert = await this.alertCtrl.create({
          header: 'Actualización exitosa',
          message: 'Tu perfil ha sido actualizado correctamente.',
          buttons: ['OK'],
        });
        await alert.present();
      } catch (error) {
        const alert = await this.alertCtrl.create({
          header: 'Error',
          message: (error as { message: string }).message || 'Error al actualizar el perfil.',
          buttons: ['OK'],
        });
        await alert.present();
      }
    }
  }

  // Confirm before deleting account
  async confirmDeleteAccount() {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.deleteAccount();
          }
        }
      ]
    });

    await alert.present();
  }

  // Delete the user's account
  async deleteAccount() {
    const user = await this.afAuth.currentUser;
    if (user) {
      try {
        // Remove user data from Firebase Realtime Database first
        await this.db.object(`/users/${user.uid}`).remove();
        console.log('User data deleted from Realtime Database');
  
        // Now delete the user from Firebase Authentication
        await user.delete();
        console.log('User account deleted');
  
        // Unsubscribe after user data is deleted
        if (this.subscription) {
          this.subscription.unsubscribe();
        }
  
        // Sign out the user after deletion
        await this.afAuth.signOut();
  
        // Redirect to home page after deletion
        this.router.navigate(['/home']);
  
        const alert = await this.alertCtrl.create({
          header: 'Cuenta eliminada',
          message: 'Tu cuenta ha sido eliminada correctamente.',
          buttons: ['OK'],
        });
        await alert.present();
      } catch (error) {
        const alert = await this.alertCtrl.create({
          header: 'Error',
          message: (error as { message: string }).message || 'Error al eliminar la cuenta.',
          buttons: ['OK'],
        });
        await alert.present();
      }
    }
  }
}
