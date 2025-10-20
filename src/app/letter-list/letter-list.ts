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
  letters: Letter[] = [];
  displayedLetters: Letter[] = [];

  currentPage: number = 1;
  pageSize: number = 8;
  totalPages: number = 0;

  selectedLetter: Letter | null = null;
  isModalOpen: boolean = false;

  constructor(
    private letterService: LetterService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getLetters();
  }

  private getLetters(): void {
    this.letterService.getAllLetters().subscribe(data => {
      this.letters = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      this.updateDisplayedLetters();
      this.cdRef.markForCheck();
    });
  }

  updateDisplayedLetters(): void {
    this.totalPages = Math.ceil(this.letters.length / this.pageSize);
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.displayedLetters = this.letters.slice(start, end);
  }

  openLetter(letter: Letter): void {
    this.selectedLetter = letter;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedLetter = null;
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updateDisplayedLetters();
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  prevPage(): void {
    this.goToPage(this.currentPage - 1);
  }


  openPdf(letter: Letter) {
    this.letterService.downloadLetter(letter.id).subscribe({
      next: (data: Blob) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url); // otvara PDF u novom tabu
      },
      error: (err) => {
        console.error('Error opening PDF:', err);
        alert('Failed to open PDF.');
      }
    });
  }
}
