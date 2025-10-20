import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MedicationService } from '../medication-service';
import { Medication } from '../medication';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AdminService } from '../admin-service';
import { LetterService, LetterDTO } from '../letter-service';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators'; // ⭐ DODATI OVO

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

  selectedMedications: Medication[] = [];
  isModalOpen: boolean = false;
  letterTitle: string = '';
  letterDescription: string = '';
  letterText: string = '';
  selectedFile: File | null = null;

  constructor(
    private medicationService: MedicationService,
    private cdRef: ChangeDetectorRef,
    private http: HttpClient,
    private adminService: AdminService,
    private letterService: LetterService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getMedications();
    this.isModalOpen = false; // ⭐ DODAJTE OVO
    this.selectedFile = null; // ⭐ I OVO
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
    const index = this.selectedMedications.findIndex(m => m.id === lekId);
    if (index > -1) {
      this.selectedMedications.splice(index, 1);
    } else {
      this.selectedMedications.push(lek);
    }
    console.log('Selected medication:', this.selectedMedications);
    this.cdRef.markForCheck(); // Forsira proveru promena
  }

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
    this.letterTitle = '';
    this.letterDescription = '';
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  sendLetter(): void {
    this.adminService.currentAdmin$.pipe(take(1)).subscribe(admin => { 
      
      if (!admin) {
        alert('No admin logged in!');
        return;
      }

      if (!this.selectedFile) {
        alert('Please attach a PDF file!');
        return;
      }

      const letterDTO = {
        title: this.letterTitle,
        description: this.letterDescription,
        adminId: admin.id,
        medicationIds: this.selectedMedications.map(m => m.id)
      };

      this.letterService.sendLetterWithFile(letterDTO, this.selectedFile).subscribe({
        next: () => {
          alert('Letter successfully sent!');
          this.letterTitle = '';
          this.letterDescription = '';
          this.letterText = '';
          this.selectedMedications = [];
          this.selectedFile = null;

          // Zatvori modal
          this.isModalOpen = false;
          this.router.navigate(['/admin']).then(() => {
            this.router.navigate(['/makeALetter']); // Pređite prvo na neutralnu rutu, pa nazad
          });
          this.cdRef.detectChanges();
        },
        error: err => {
          console.error('Error uploading letter:', err);
          alert('Error sending letter!');
        }
      });
    });
  }

  emptySelectedMedications(): void {
    this.selectedMedications = [];
    this.cdRef.markForCheck();
  }

}
