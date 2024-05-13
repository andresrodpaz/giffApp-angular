import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SearchResponse, Gif } from '../interfaces/gifs.interfaces';

/**
 * Service to interact with the Giphy API and manage gif search.
 *
 * This service provides methods for performing gif searches, managing search tag history,
 * and storing related information in the browser's local storage.
 */
@Injectable({ providedIn: 'root' })
export class GifsService {
  /** List of gifs obtained through the search. */
  public gifList: Gif[] = [];

  /** Search tag history. */
  private _tagsHistory: string[] = [];

  /** API key for the Giphy API used to make requests. */
  private apiKey: string = '4OVZwFtmnf9GWThZDxERwCTTneQttvc6';

  /** Base URL of the Giphy service. */
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs';

  /**
   * Service constructor.
   * @param http HttpClient object used to make HTTP requests.
   */
  constructor(private http: HttpClient) {
    // Load the tag history from local storage when the service initializes.
    this.loadLocalStorage();
    console.log('Gifs Service Ready');
  }

  /** Get a copy of the search tag history. */
  get tagsHistory() {
    return [...this._tagsHistory];
  }

  /**
   * Organize the search tag history and update it with the new tag.
   * @param tag Search tag.
   */
  private organizeHistory(tag: string) {
    // Convert the tag to lowercase for consistency.
    tag = tag.toLowerCase();

    // Remove the existing tag if it's already in the history.
    if (this._tagsHistory.includes(tag)) {
      this._tagsHistory = this._tagsHistory.filter((oldTag) => oldTag !== tag);
    }

    // Add the new tag to the beginning of the history.
    this._tagsHistory.unshift(tag);

    // Limit the history length to 10 elements.
    this._tagsHistory = this._tagsHistory.slice(0, 10);

    // Save the updated history to local storage.
    this.saveLocalStorage();
  }


  /** Save the search tag history to the browser's local storage. */
  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  /** Load the search tag history from the browser's local storage. */
  private loadLocalStorage(): void {
    // Check if there is stored history in the browser.
    if (!localStorage.getItem('history')) return;

    // Load the history stored in the browser.
    this._tagsHistory = JSON.parse(localStorage.getItem('history')!);

    // If the history is not empty, perform a search with the first tag.
    if (this._tagsHistory.length === 0) return;
    this.searchTag(this._tagsHistory[0]);
  }

  /**
   * Perform a gif search on Giphy based on the provided tag.
   * @param tag Search tag.
   */
  searchTag(tag: string): void {
    // Avoid the search if the tag is empty.
    if (tag.length === 0) return;

    // Organize and update the history with the new tag.
    this.organizeHistory(tag);

    // Set up parameters for the HTTP request.
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', tag);

    // Make the HTTP request to search for gifs on Giphy.
    this.http
      .get<SearchResponse>(`${this.serviceUrl}/search`, { params })
      .subscribe((resp) => {
        // Store the obtained gifs in the service's gifList.
        this.gifList = resp.data;
        // You can uncomment the following line to log the gifs to the console.
        // console.log({ gifs: this.gifList });
      });
  }
  /**
   * Clears the search tag history.
   *
   * This method sets the search tag history to an empty array and updates the local storage.
   */
  clearHistory(): void {
    // Clear the search tag history.
    this._tagsHistory = [];

    // Save the updated history to local storage.
    this.saveLocalStorage();
  }

  /**
   * Removes a specific tag from the search tag history.
   *
   * This method filters the search tag history to exclude the specified tag, updates the
   * local storage, and ensures that the history remains limited to 10 elements.
   *
   * @param tag The search tag to be removed from the history.
   */
  removeTagFromHistory(tag: string): void {
    // Filter out the specified tag from the search tag history.
    this._tagsHistory = this._tagsHistory.filter((oldTag) => oldTag !== tag);

    // Save the updated history to local storage.
    this.saveLocalStorage();
  }
}
