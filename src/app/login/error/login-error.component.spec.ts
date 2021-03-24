import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LoginErrorComponent} from './login-error.component';

describe('ErrorComponent', () => {
  let component: LoginErrorComponent;
  let fixture: ComponentFixture<LoginErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginErrorComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
