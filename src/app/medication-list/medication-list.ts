import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MedicationService } from '../medication-service';
import { Medication } from '../medication';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../admin-service';
import { LetterService} from '../letter-service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-medication-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './medication-list.html',
  styleUrls: ['./medication-list.css']
})
export class MedicationList implements OnInit {
  medications: Medication[] = [];                   // Svi lekovi
  displayedMedications: Medication[] = [];          // Lekovi za prikaz na trenutnoj stranici

  alphabet: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');     // Abeceda za filtriranje
  currentLetter: string = '';                                      // Trenutno izabrano slovo za filtriranje

  currentPage: number = 1;                                         // Trenutna stranica
  pageSize: number = 100;                                          // Broj lekova po stranici
  totalPages: number = 0;                                          // Ukupan broj stranica

  selectedLekId: string | null = null;                             // ID izabranog leka

  selectedMedications: Medication[] = [];                          // Izabrani lekovi za slanje u pismu
  isModalOpen: boolean = false;                                    // Stanje modala za slanje pisma
  letterTitle: string = '';                                        // Naslov pisma
  letterDescription: string = '';                                  // Opis pisma
  selectedFile: File | null = null;                                // Izabrani PDF fajl

  constructor(                                                     // Injektovanje servisa
    private medicationService: MedicationService,
    private cdRef: ChangeDetectorRef,
    private adminService: AdminService,
    private letterService: LetterService,
  ) { }

  ngOnInit(): void {                                               // Inicijalizacija komponente, uzima lekove i resetuje modal
    this.getMedications();
    this.isModalOpen = false;
    this.selectedFile = null;
  }

  private getMedications() {                                             // Uzimanje liste lekova iz servisa, pretplata na Observable, azuriranje prikaza i detekcija promena
    this.medicationService.getMedicationList().subscribe(data => {
      this.medications = data;
      this.updateDisplayedMedications();
      this.cdRef.markForCheck();
    });
  }

  filterByLetter(letter: string) {                                      // Filtriranje lekova po slovu, resetovanje stranice i azuriranje prikaza
    this.currentLetter = letter;
    this.currentPage = 1;
    this.updateDisplayedMedications();
  }

  updateDisplayedMedications() {                                        // Azuriranje prikazanih lekova na osnovu trenutnog slova i stranice
    let filtered = this.medications;
    if (this.currentLetter) {
      filtered = this.medications.filter(med =>
        med.name.toUpperCase().startsWith(this.currentLetter)
      );
    }
    this.totalPages = Math.ceil(filtered.length / this.pageSize);
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.displayedMedications = filtered.slice(start, end);
  }

  goToPage(page: number) {                                               // Navigacija na stranicu, azuriranje prikaza
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updateDisplayedMedications();
  }

  nextPage() {                                                            // Navigacija na sledeću stranicu
    this.goToPage(this.currentPage + 1);
  }
 
  prevPage() {                                                          // Navigacija na prethodnu stranicu
    this.goToPage(this.currentPage - 1);
  }

  scrollToTop(): void {                                            // Skrolovanje na vrh stranice
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  trackByMedicationId(index: number, medication: any): string {     // Praćenje lekova po ID-ju za optimizaciju performansi
    return medication.id;
  }

  onRowClick(lek: Medication): void {                                       // Rukovanje klikom na red, izbor/odabir leka
    const lekId = String(lek.id);                                            // Dobijanje ID-ja leka kao string
    const index = this.selectedMedications.findIndex(m => m.id === lekId);
    if (index > -1) {
      this.selectedMedications.splice(index, 1);                               // Uklanjanje leka iz izabranih ako je već izabran
    } else {
      this.selectedMedications.push(lek);                                     // Dodavanje leka u izabrane ako nije izabran
    }
    console.log('Selected medication:', this.selectedMedications);            // Ispis izabranih lekova
    this.cdRef.markForCheck();                                                // Forsira proveru promena
  }

  isLekSelected(lek: Medication): boolean {                           // Provera da li je lek izabran
    return this.selectedMedications.some(m => m.id === lek.id);            // Vraća true ako je lek izabran, inače false
  }

  openModal(): void {                                               // Otvaranje modala za slanje pisma, provera da li je izabran bar jedan lek
    if (this.selectedMedications.length === 0) {                              
      alert('You have to select at least one medication');
      return;
    }
    this.isModalOpen = true;
  }


  closeModal(): void {                                              // Zatvaranje modala i resetovanje polja
    this.isModalOpen = false;
    this.letterTitle = '';
    this.letterDescription = '';
  }

  onFileSelected(event: any): void {                                      // Rukovanje izborom fajla iz inputa
    this.selectedFile = event.target.files[0];                            // Postavljanje izabranog fajla
  }

  sendLetter(): void {                                                   // Slanje pisma sa izabranim lekovima i fajlom
    this.adminService.currentAdmin$.pipe(take(1)).subscribe(admin => {   // Uzimanje trenutno ulogovanog admina, take (1) za jednokratnu pretplatu

      if (!admin) {                                                      // Provera da li je admin ulogovan
        alert('No admin logged in!');
        return;
      }

      if (!this.selectedFile) {                                            // Provera da li je izabran fajl
        alert('Please attach a PDF file!');
        return;
      }

      const letterDTO = {                                                 // Kreiranje DTO objekta za pismo
        title: this.letterTitle,
        description: this.letterDescription,
        adminId: admin.id,
        medicationIds: this.selectedMedications.map(m => m.id)             // Mapiranje izabranih lekova na njihove ID-jeve
      };

      this.letterService.sendLetterWithFile(letterDTO, this.selectedFile).subscribe({     // Slanje pisma sa fajlom putem servisa
        next: () => {                                                                     
          alert('Letter successfully sent!');
          this.letterTitle = '';                                                   // Resetovanje polja nakon uspešnog slanja
          this.letterDescription = '';
          this.selectedMedications = [];
          this.selectedFile = null;
          this.isModalOpen = false;                                               // Zatvaranje modala nakon uspešnog slanja
          this.cdRef.detectChanges();                                             // Detekcija promena nakon slanja pisma
        },
        error: err => {                                                          // Rukovanje greškom pri slanju pisma
          console.error('Error uploading letter:', err);   
          alert('Error sending letter!');
        }
      });
    });
  }

  emptySelectedMedications(): void {                                          // Pražnjenje liste izabranih lekova
    this.selectedMedications = [];
    this.cdRef.markForCheck();
  }

}
