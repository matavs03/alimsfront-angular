import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MedicationService } from '../medication-service';
import { Medication } from '../medication';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-medication-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './medication-list.html',
  styleUrls: ['./medication-list.css']
})
export class MedicationList implements OnInit {
  medications: Medication[] = [];
  displayedMedications: Medication[] = [];

  alphabet: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  currentLetter: string = '';

  currentPage: number = 1;
  pageSize: number = 100;
  totalPages: number = 0;

  selectedLekId: string | null = null;

  // NOVO: Lista lekova za pismo
  selectedMedications: Medication[] = [];
  // NOVO: Kontrola prikaza modala
  isModalOpen: boolean = false;
  // NOVO: Tekst koji će se upisati u pismo
  letterText: string = '';



  constructor(
    private medicationService: MedicationService,
    private cdRef: ChangeDetectorRef // INJEKTOVAN ChangeDetectorRef
  ) { }




  ngOnInit(): void {
    this.getMedications();
  }



  private getMedications() {
    this.medicationService.getMedicationList().subscribe(data => {
      this.medications = data;
      this.updateDisplayedMedications();
      this.cdRef.markForCheck();
    });
  }

  filterByLetter(letter: string) {
    this.currentLetter = letter;
    this.currentPage = 1;
    this.updateDisplayedMedications();
    // this.cdRef.markForCheck(); 
  }

  updateDisplayedMedications() {
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

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updateDisplayedMedications();
    // this.cdRef.markForCheck(); 
  }

  nextPage() {
    this.goToPage(this.currentPage + 1);
  }

  prevPage() {
    this.goToPage(this.currentPage - 1);
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  trackByMedicationId(index: number, medication: any): string {
    return medication.id;
  }

  onRowClick(lek: Medication): void {
    const lekId = String(lek.id);

    // Logika za dodavanje/uklanjanje iz selectedMedications (toggle)
    const index = this.selectedMedications.findIndex(m => m.id === lekId);

    if (index > -1) {
      // Lek je već u listi, ukloni ga (Poništi bojenje i izbaci iz liste)
      this.selectedMedications.splice(index, 1);
    } else {
      // Lek nije u listi, dodaj ga (Postavi bojenje i dodaj u listu)
      this.selectedMedications.push(lek);

    }

    console.log('Selected medication:', this.selectedMedications);
    this.cdRef.markForCheck(); // Forsira proveru promena
  }

  // NOVO: Provera za ispravno obeležavanje reda (sa ikonom)
  isLekSelected(lek: Medication): boolean {
    return this.selectedMedications.some(m => m.id === lek.id);
  }

  openModal(): void {
    if (this.selectedMedications.length === 0) {
      alert('You have to select at least one medication');
      return;
    }
    this.isModalOpen = true;
  }


  closeModal(): void {
    this.isModalOpen = false;
    this.letterText = '';
  }

  sendLetter(): void {
    console.log('--- Slanje Pisma ---');
    console.log('Lekovi:', this.selectedMedications);
    console.log('Tekst Pisma:\n', this.letterText);

    alert('Letter sent');

    this.selectedMedications = [];
    this.closeModal();
  }

  emptySelectedMedications(): void {
    this.selectedMedications = [];
    this.cdRef.markForCheck();
  }

}
