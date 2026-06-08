import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { GenerationApi } from '../../services/generation-api';
import { GenerationDetail } from '../../models/generation';
import { TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-generations',
  standalone: true,
  imports: [TitleCasePipe],
  templateUrl: './generations.html',
  styleUrl: './generations.css',
})
export class Generations {
  private genApi = inject(GenerationApi);
  private router = inject(Router);

  public gens = toSignal(this.genApi.getAllGen(), { initialValue: [] });

  public selectedGenDetails = signal<GenerationDetail | null>(null);
  public isLoadingDetails = signal<boolean>(false);

  public openGenDetails(genName: string) {
    this.isLoadingDetails.set(true);
    this.genApi.getGenerationDetails(genName).subscribe({
      next: (details) => {
        this.selectedGenDetails.set(details);
        this.isLoadingDetails.set(false);
      },
      error: () => this.isLoadingDetails.set(false),
    });
  }

  public closePopUp() {
    this.selectedGenDetails.set(null);
  }
  public goToPokemonPage(pokemonName: string) {
    this.closePopUp();
    this.router.navigate(['/pokemons'], {
      queryParams: { search: pokemonName },
    });
  }
}
