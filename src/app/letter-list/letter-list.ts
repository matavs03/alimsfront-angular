import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LetterService } from '../letter-service';
import { Letter } from '../letter';

@Component({
  selector: 'app-letter-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './letter-list.html',
  styleUrls: ['./letter-list.css']
})
export class LetterList implements OnInit {
  letters: Letter[] = [];        // Sva pisma
  displayedLetters: Letter[] = [];   // Pisma koja se prikazuju na trenutnoj stranici

  currentPage: number = 1;    // Trenutna stranica
  pageSize: number = 8;       // Broj pisama po stranici
  totalPages: number = 0;      // Ukupan broj stranica    

  selectedLetter: Letter | null = null;     // Trenutno izabrano pismo za prikaz u modalnom prozoru
  isModalOpen: boolean = false;             // Stanje modalnog prozora

  constructor(
    private letterService: LetterService,               // Servis za dobijanje pisama
    private cdRef: ChangeDetectorRef                    // Za ručno pokretanje detekcije promena
  ) { }

  ngOnInit(): void {           // Inicijalizacija komponente
    this.getLetters();
  }

  private getLetters(): void {                                    // Dobijanje pisama iz servisa
    this.letterService.getAllLetters().subscribe(data => {
      this.letters = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());      // Sortiranje pisama po datumu opadajuce
      this.updateDisplayedLetters();                                                        // Ažuriranje prikazanih pisama
      this.cdRef.markForCheck();                                                             // Ručno pokretanje detekcije promena
    });
  }

  updateDisplayedLetters(): void {                                                     // Ažuriranje prikazanih pisama na osnovu trenutne stranice
    this.totalPages = Math.ceil(this.letters.length / this.pageSize);                    // Izračunavanje ukupnog broja stranica
    const start = (this.currentPage - 1) * this.pageSize;                                // Izračunavanje početnog indeksa
    const end = start + this.pageSize;                                                    // Izračunavanje krajnjeg indeksa
    this.displayedLetters = this.letters.slice(start, end);                               // Postavljanje prikazanih pisama
  }

  openLetter(letter: Letter): void {                                // Otvaranje modalnog prozora sa detaljima pisma
    this.selectedLetter = letter;                                     // Postavljanje izabranog pisma
    this.isModalOpen = true;                                          // Otvaranje modalnog prozora
  }

  closeModal(): void {                                              // Zatvaranje modalnog prozora
    this.isModalOpen = false;                                       // Postavljanje stanja modalnog prozora na zatvoreno
    this.selectedLetter = null;                                     // Resetovanje izabranog pisma
  }

  goToPage(page: number): void {                                 // Navigacija na određenu stranicu                         
    if (page < 1 || page > this.totalPages) return;             // Provera validnosti stranice
    this.currentPage = page;                                   // Postavljanje trenutne stranice
    this.updateDisplayedLetters();                            // Ažuriranje prikazanih pisama
  }

  nextPage(): void {                                       // Navigacija na sledeću stranicu                          
    this.goToPage(this.currentPage + 1);
  }

  prevPage(): void {                                        // Navigacija na prethodnu stranicu
    this.goToPage(this.currentPage - 1);
  }


  openPdf(letter: Letter) {                                        // Otvaranje PDF pisma u novom tabu
    this.letterService.downloadLetter(letter.id).subscribe({       // Pretpostavlja se da servis vraća Blob podatke
      next: (data: Blob) => {                                      
        const blob = new Blob([data], { type: 'application/pdf' });  // Kreiranje Blob objekta za PDF
        const url = window.URL.createObjectURL(blob);                // Kreiranje URL-a za Blob
        window.open(url);                                           // otvara PDF u novom tabu
      },
      error: (err) => {                                              // Obrada greške pri preuzimanju PDF-a
        console.error('Error opening PDF:', err);
        alert('Failed to open PDF.');
      }
    });
  }

  goToEducationalMaterials(){
    window.location.href = 'http://localhost:5173/show';
  }
}
