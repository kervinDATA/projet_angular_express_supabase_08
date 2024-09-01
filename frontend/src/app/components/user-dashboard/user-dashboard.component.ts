import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/signup.service';
import { ListingsService } from '../../services/listings.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  listings: any[] = [];
  searchTerm: string = '';
  currentPage: number = 0;
  pageSize: number = 100;
  neighbourhoods: string[] = ['Popincourt', 'Buttes-Chaumont', 'Hôtel-de-Ville', 'Élysée', 'Bourse', 'Luxembourg', 'Louvre',
    'Batignolles-Monceau', 'Reuilly', 'Panthéon', 'Entrepôt', 'Passy', 'Ménilmontant', 'Opéra', 'Observatoire', 'Buttes-Montmartre',
    'Temple', 'Gobelins', 'Palais-Bourbon', 'Vaugirard'];
  roomTypes: string[] = ['Entire home/apt', 'Shared room', 'Private room', 'Hotel room'];
  selectedNeighbourhood: string = '';
  selectedRoomType: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  username: string | null = null;
  isLoggedIn: boolean = false;

  constructor(
    private listingsService: ListingsService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(username => {
      this.username = username;
      this.isLoggedIn = !!username;

      if (!this.isLoggedIn) {
        this.router.navigate(['/login']); // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
      } else {
        this.loadListings(); // Charger les annonces si l'utilisateur est connecté
      }
    });
  }

  logout(): void {
    this.authService.logout(); // Ne retourne pas un observable, donc pas besoin de subscribe
    this.username = null;
    this.isLoggedIn = false;
    this.router.navigate(['/']); // Rediriger vers la page d'accueil après la déconnexion
  }

  loadListings(): void {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize - 1;

    this.listingsService.getListings(start, end, this.searchTerm, this.selectedNeighbourhood, 
      this.selectedRoomType, this.minPrice, this.maxPrice).subscribe(
      (data) => {
        this.listings = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des listings:', error);
      }
    );
  }

  filterListings(): void {
    this.currentPage = 0;
    this.loadListings();
  }

  searchListings(): void {
    this.currentPage = 0;
    this.loadListings();
  }

  nextPage(): void {
    this.currentPage++;
    this.loadListings();
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadListings();
    }
  }
}
