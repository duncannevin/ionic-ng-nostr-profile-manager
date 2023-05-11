import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'nostr-profile-metadata',
  templateUrl: './metadata.component.html',
  styleUrls: ['./metadata.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class MetadataComponent implements OnInit {
  isWeb = false;

  ngOnInit(): void {
    this.isWeb = this.platform.is('mobileweb') || !this.platform.is('mobile');
  }

  constructor(private platform: Platform) {}
}
