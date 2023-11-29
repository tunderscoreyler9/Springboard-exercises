"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

function storyIsFavoriteForUser(currentUser, story) {
  // Check if the story is in the user's favorites list
  return currentUser && currentUser.favorites.some(favorite => favorite.storyId === story.storyId);
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  const hostName = story.getHostName();
  const $story = $(`
    <li id="${story.storyId}">
      <a href="${story.url}" target="_blank" class="story-link">
        ${story.title}
      </a>
      <small class="story-hostname">(${hostName})</small>
      <small class="story-author">by ${story.author}</small>
      <small class="story-user">posted by ${story.username}</small>
      <button class="favorite-button">Favorite</button>
      <button class="delete-button">Delete</button>
    </li>
  `);

  // Check if the story is already favorited by the current user
  if (currentUser && storyIsFavoriteForUser(currentUser, story)) {
    $story.find('.favorite-button').text('Unfavorite');
  }

  // Handle click on the favorite button
  $story.find('.favorite-button').on('click', async function (event) {
    event.preventDefault();

    if (currentUser) {
      try {
        if (storyIsFavoriteForUser(currentUser, story)) {
          await story.unmarkAsFavorite(currentUser);
          // Update UI to reflect the story is no longer a favorite
          $(this).text('Favorite');
        } else {
          await story.markAsFavorite(currentUser);
          // Update UI to reflect the story is now a favorite
          $(this).text('Unfavorite');
        }
      } catch (error) {
        console.error('Error marking/unmarking story as favorite:', error);
        // Handle error, if any
      }
    } else {
      // Prompt user to log in if not logged in
      // Example: show a message or modal to log in
    }
  });

  $story.find('.delete-button').on('click', async function (event) {
    event.preventDefault();

    if (currentUser) {
      try {
        await story.deleteStory(currentUser);
        // Remove the story from the DOM
        $(`#${story.storyId}`).remove();
      } catch (error) {
        console.error('Error deleting story:', error);
        // Handle error, if any
      }
    } else {
      // Prompt user to log in if not logged in
      // Example: show a message or modal to log in
    }
  });

  return $story;
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

function displayNewStory(story) {
  const $newStory = generateStoryMarkup(story); // Generate markup for the new story
  $allStoriesList.prepend($newStory); // Prepend the new story to the top of the list
}

async function loadMoreStories() {
  try {
    const moreStories = await StoryList.getStories();
    storyList.stories.push(...moreStories.stories);
    putStoriesOnPage();
  } catch (error) {
    console.error('Error loading more stories:', error);
    // Handle error, if any
  }
}


$('#add-story-form').on('submit', async function (event) {
  event.preventDefault();

  const title = $('#story-title').val();
  const author = $('#story-author').val();
  const url = $('#story-url').val();

  try {
    let newStory = await storyList.addStory(currentUser, { title, author, url });
    // Update UI to display the new story (You'll need to write this part)
    // For example, append the new story to the story list on the page.
    displayNewStory(newStory); // Replace this with your UI update logic
  } catch (error) {
    console.error('Error adding story:', error);
    // Handle error, if any
  }
});

// ******************************************** adding favs:
// Example usage: Assuming 'story' is an instance of Story
$('#favorite-button').on('click', async function (event) {
  event.preventDefault();

  if (currentUser) {
    try {
      if (storyIsFavoriteForUser(currentUser, story)) {
        await story.unmarkAsFavorite(currentUser);
        // Update UI to reflect the story is no longer a favorite
        // For example, change the appearance of the favorite button
      } else {
        await story.markAsFavorite(currentUser);
        // Update UI to reflect the story is now a favorite
        // For example, change the appearance of the favorite button
      }
    } catch (error) {
      console.error('Error marking/unmarking story as favorite:', error);
      // Handle error, if any
    }
  } else {
    // Prompt user to log in if not logged in
    // Example: show a message or modal to log in
  }
});

$(window).on('scroll', function() {
  // Check if user has scrolled to the bottom
  if ($(window).scrollTop() + $(window).height() >= $(document).height()) {
    // Load more stories
    loadMoreStories();
  }
});