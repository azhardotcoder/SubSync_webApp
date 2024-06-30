# Subscription Manager

A simple subscription management web application that uses Firebase for authentication and data storage. It allows you to add, view, and manage subscriptions easily.

## Features

- **User Authentication**: Supports Google and Phone sign-in.
- **Add New Subscriptions**: Allows adding new subscriptions with details such as subscription name, UID, POD, EOD, amount received, plan details, and customer number.
- **View and Manage Subscriptions**: Subscriptions can be viewed, searched, and managed in a list format.
- **Edit and Update Subscriptions**: Provides functionality to update subscription details.
- **Search and Filtering**: Highlight search terms and filter subscriptions by details.

## Prerequisites

- Node.js and npm (for package management)
- A Firebase project with Realtime Database and Authentication enabled

## Setup

### Firebase Configuration

1. **Create a Firebase project** in the Firebase Console.
2. **Enable Firebase Authentication** with Google and Phone providers.
3. **Set up Firebase Realtime Database** and update the rules to allow authenticated users:

    ```json
    {
      "rules": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    }
    ```

