import { Observable } from 'rxjs';

export interface INavMenu {
  name: string;
  link: string;
  condition$?: Observable<boolean>;
}
