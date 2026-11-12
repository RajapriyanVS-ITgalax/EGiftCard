import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'splash',
    loadComponent: () => import('./splash/splash.page').then((m) => m.SplashPage),
  },
  {
    path: 'welcome',
    loadComponent: () => import('./welcome/welcome.page').then((m) => m.WelcomePage),
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'gift-cards/:id',
    loadComponent: () => import('./gift-card/gift-card.page').then((m) => m.GiftCardPage),
  },
  {
    path: 'gift-cards',
    loadComponent: () => import('./shop/gift-cards/gift-cards.page').then((m) => m.GiftCardsPage),
  },
  {
    path: 'cart',
    loadComponent: () => import('./shop/cart/cart.page').then((m) => m.CartPage),
  },
  {
    path: 'checkout',
    loadComponent: () => import('./shop/checkout/checkout.page').then((m) => m.CheckoutPage),
  },
  {
    path: 'payment',
    loadComponent: () => import('./shop/payment/payment.page').then((m) => m.PaymentPage),
  },
  {
    path: 'review',
    loadComponent: () => import('./shop/review/review.page').then((m) => m.ReviewPage),
  },
  {
    path: 'complete-purchase',
    loadComponent: () => import('./shop/complete-purchase/complete-purchase.page').then((m) => m.CompletePurchasePage),
  },
  {
    path: 'payment-success',
    loadComponent: () => import('./shop/payment-success/payment-success.page').then((m) => m.PaymentSuccessPage),
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.page').then((m) => m.ProfilePage),
  },
  {
    path: 'wallet',
    loadComponent: () => import('./shop/wallet/wallet.page').then((m) => m.WalletPage),
  },
  {
    path: 'biometric-setup',
    loadComponent: () =>
      import('./account/biometric-setup/biometric-setup.page').then((m) => m.BiometricSetupPage),
  },
  {
    path: 'notifications',
    loadComponent: () => import('./account/notifications/notifications.page').then((m) => m.NotificationsPage),
  },
  {
    path: 'contacts',
    loadComponent: () => import('./account/contacts/contacts.page').then((m) => m.ContactsPage),
  },
  {
    path: 'help',
    loadComponent: () => import('./account/help/help.page').then((m) => m.HelpPage),
  },
  {
    path: 'settings',
    loadComponent: () => import('./account/settings/settings.page').then((m) => m.SettingsPage),
  },
  {
    path: 'personal-info',
    loadComponent: () => import('./account/personal-info/personal-info.page').then((m) => m.PersonalInfoPage),
  },
  {
    path: 'contact-details',
    loadComponent: () =>
      import('./account/contact-details/contact-details.page').then((m) => m.ContactDetailsPage),
  },
  {
    path: 'security',
    loadComponent: () => import('./account/security/security.page').then((m) => m.SecurityPage),
  },
  {
    path: 'terms',
    data: { doc: 'terms' },
    loadComponent: () => import('./account/legal/legal.page').then((m) => m.LegalPage),
  },
  {
    path: 'privacy',
    data: { doc: 'privacy' },
    loadComponent: () => import('./account/legal/legal.page').then((m) => m.LegalPage),
  },
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full',
  },
];
