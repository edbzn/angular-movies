import { ChangeDetectionStrategy, Component } from '@angular/core';
import { getActions } from '../../shared/rxa-custom/actions';
import { AuthEffects } from '../../shared/auth/auth.effects';
import { RxState } from '@rx-angular/state';
import { AuthState } from '../../shared/auth/auth.state';
import { map } from 'rxjs';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LetModule } from '@rx-angular/template';

export const imports = [RouterModule, CommonModule, LetModule];

@Component({
  selector: 'account-menu',
  templateUrl: './account-menu.component.html',
  styleUrls: ['./account-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class AccountMenuComponent {
  ui = getActions<{
    signOut: Event;
    signIn: Event;
  }>();

  loggedIn$ = this.state.select('loggedIn');

  constructor(
    private authEffects: AuthEffects,
    private authState: AuthState,
    private state: RxState<{ loggedIn: boolean }>
  ) {
    this.state.connect(
      'loggedIn',
      this.authState.accountId$.pipe(map((s) => s !== null))
    );
    this.state.hold(this.ui.signOut$, this.authEffects.signOut);
    this.state.hold(this.ui.signIn$, () =>
      this.authEffects.approveRequestToken()
    );
  }
}
