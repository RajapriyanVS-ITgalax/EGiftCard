import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class LogoutService {
  private readonly alert = inject(AlertController);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  async confirm(): Promise<void> {
    const dialog = await this.alert.create({
      header: 'Logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        { text: 'No', role: 'cancel' },
        {
          text: 'Yes',
          role: 'confirm',
          handler: () => {
            this.auth.logout();
            void this.router.navigateByUrl('/home', { replaceUrl: true });
          },
        },
      ],
    });
    await dialog.present();
  }
}
