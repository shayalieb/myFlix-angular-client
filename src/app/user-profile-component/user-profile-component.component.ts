import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-user-profile-component',
  templateUrl: './user-profile-component.component.html',
  styleUrls: ['./user-profile-component.component.scss']
})
export class UserProfileComponentComponent implements OnInit {
  user: any = {};
  favoriteMovies: any[] =[];

  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    this.fetchApiData.getOneUser().subscribe((resp: any) => {
      this.user = resp;
      this.userData.Username = this.user.Username;
      this.userData.Email = this.user.Email;
      this.user.Birthday = formatDate(this.user.Birthday, 'mm-dd-yyyy', 'en-US', 'UTC+4');

      this.fetchApiData.getMovies().subscribe((resp: any) => {
        this.favoriteMovies = resp.filter((m: { _id: any}) => this.user.FavoriteMovies.indexOf(m._id) >= 0)
      })
    })
  }

  editUser(): void {
    this.fetchApiData.editUser(this.userData).subscribe((data) => {
      localStorage.setItem('user', JSON.stringify(data));
      localStorage.setItem('Username', data.Username);
      this.snackBar.open('Your profile has been updated!', 'OK', {
        duration: 2000
      })
      window.location.reload();
    }, (result) => {
      this.snackBar.open(result, 'OK', {
        duration: 2000
      })
    })
  }

  deleteUser(): void {
    if(confirm('Are you sure?')) {
      this.router.navigate(['welcome']).then(() => {
        this.snackBar.open(
          'You have successfully deleted your account', 'OK', {
            duration: 2000
          }
        )
      });
      this.fetchApiData.deleteUser().subscribe((result) => {
        console.log(result);
        localStorage.clear();
      });
    }
  }
}