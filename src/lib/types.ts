export class Emote {
  name: string;
  url: string;
  nameLower: string;

  constructor(name: string, url: string) {
    this.name = name;
    this.url = url;
    this.nameLower = name.toLocaleLowerCase();
  }
}

export class ChatPronoun {
  id: number;
  subject: string;
  object: string;
  singular: boolean;

  constructor(id: number, subject: string, object: string, singular: boolean) {
    this.id = id;
    this.subject = subject;
    this.object = object;
    this.singular = singular;
  }
}

export enum ActionType {
  None = "none",
  Changelog = "changelog",
  ChatPoll = "chatPoll",
}

export type FanslyResponse<T> = {
  success: boolean;
  response: T;
  error: any; // TODO: Define
};

export type FanslyAccountResponse = {
  id: string;
  username: string;
  displayName?: string;
  flags: number;
  version: number;
  createdAt: number;
  followCount: number;
  subscriberCount: number;
  permissions: {
    accountPermissionFlags: {
      flags: number;
    };
  };
  timelineStats: {
    accountId: string;
    imageCount: number;
    videoCount: number;
    bundleCount: number;
    bundleImageCount: number;
    bundleVideoCount: number;
    fetchedAt: number;
  };
  postLikes: number;
  mediaStoryState: {
    accountId: string;
    status: number;
    storyCount: number;
    version: number;
    createdAt: number;
    updatedAt: number;
    hasActiveStories: boolean;
  };
  statusId: number;
  lastSeenAt: number;
  accountMediaLikes: number;
  profileAccessFlags: number;
  profileFlags: number;
  about: string;
  location: string;
  profileSocials: Array<{
    providerId: string;
    handle: string;
  }>;
  pinnedPosts: Array<{
    postId: string;
    accountId: string;
    pos: number;
    createdAt: number;
  }>;
  walls: Array<{
    id: string;
    accountId: string;
    pos?: number;
    name: string;
    description: string;
    metadata: string;
  }>;
  avatar: {
    id: string;
    type: number;
    status: number;
    accountId: string;
    mimetype: string;
    flags: number;
    location: string;
    width: number;
    height: number;
    metadata: string;
    updatedAt: number;
    createdAt: number;
    variants: Array<{
      id: string;
      type: number;
      status: number;
      mimetype: string;
      flags: number;
      location: string;
      width: number;
      height: number;
      metadata: string;
      updatedAt: number;
      locations: Array<{
        locationId: string;
        location: string;
      }>;
    }>;
    variantHash: {};
    locations: Array<{
      locationId: string;
      location: string;
    }>;
  };
  banner: {
    id: string;
    type: number;
    status: number;
    accountId: string;
    mimetype: string;
    flags: number;
    location: string;
    width: number;
    height: number;
    metadata: string;
    updatedAt: number;
    createdAt: number;
    variants: Array<{
      id: string;
      type: number;
      status: number;
      mimetype: string;
      flags: number;
      location: string;
      width: number;
      height: number;
      metadata: string;
      updatedAt: number;
      locations: Array<{
        locationId: string;
        location: string;
      }>;
    }>;
    variantHash: {};
    locations: Array<{
      locationId: string;
      location: string;
    }>;
  };
  subscriptionTiers: Array<{
    id: string;
    accountId: string;
    name: string;
    color: string;
    pos: number;
    price: number;
    maxSubscribers: number;
    subscriptionBenefits: Array<string>;
    includedTierIds: Array<string>;
    plans: Array<{
      id: string;
      status: number;
      billingCycle: number;
      price: number;
      useAmounts: number;
      promos: Array<{
        id: string;
        status: number;
        price: number;
        duration: number;
        maxUses: number;
        maxUsesBefore?: number;
        newSubscribersOnly: number;
        description: string;
        startsAt: number;
        endsAt: number;
      }>;
    }>;
  }>;
  streaming: {
    accountId: string;
    channel: {
      id: string;
      accountId: string;
      playbackUrl: string;
      chatRoomId: string;
      status: number;
      version: number;
      createdAt: number;
      updatedAt: any;
      stream: {
        id: string;
        historyId: string;
        channelId: string;
        accountId: string;
        title: string;
        status: number;
        viewerCount: number;
        version: number;
        createdAt: number;
        updatedAt: any;
        lastFetchedAt: number;
        startedAt: number;
        permissions: {
          permissionFlags: Array<{
            id: string;
            streamId: string;
            type: number;
            flags: number;
            price: number;
            metadata: string;
          }>;
        };
      };
      arn: any;
      ingestEndpoint: any;
    };
    enabled: boolean;
  };
  profileAccess: boolean;
};

export type FanslyChatroomResponse = {
  id: string;
  accountId: string;
  type: number;
  flags: number;
  status: number;
  version: number;
  createdAt: number;
  updatedAt: any;
  permissions: {
    permissionFlags: Array<{
      id: string;
      chatRoomId: string;
      type: number;
      flags: number;
      metadata: string;
    }>;
    accountPermissionFlags: {
      flags: number;
      metadata: string;
    };
    accountPermissionAggregationData: {
      following: boolean;
    };
  };
  activeGoals: Array<{
    id: string;
    chatRoomId: string;
    accountId: string;
    type: number;
    label: string;
    description: string;
    status: number;
    currentAmount: number;
    goalAmount: number;
    version: number;
    deletedAt: any;
  }>;
  accountFlags: number;
  purchased: boolean;
  whitelisted: boolean;
  accountPermissionFlags: number;
  access: boolean;
};

export type FanslyFollowingStreamsOnlineResponse = {
  streams: Array<{
    id: string;
    channelId: string;
    accountId: string;
    title: string;
    status: number;
    viewerCount: number;
    version: number;
    createdAt: number;
    updatedAt: any;
    lastFetchedAt: number;
  }>;
  aggregationData: {
    accounts: Array<FanslyFollowingStreamsOnlineAggregationDataAccount>;
  };
};

export type FanslyFollowingStreamsOnlineAggregationDataAccount = {
  id: string;
  username: string;
  displayName: string;
  flags: number;
  version: number;
  createdAt: number;
  followCount: number;
  subscriberCount: number;
  permissions: {
    accountPermissionFlags: {
      flags: number;
    };
  };
  timelineStats: {
    accountId: string;
    imageCount: number;
    videoCount: number;
    bundleCount: number;
    bundleImageCount: number;
    bundleVideoCount: number;
    fetchedAt: number;
  };
  postLikes: number;
  following: boolean;
  followsYou?: boolean;
  management?: {
    flags: number;
  };
  profileAccessFlags: number;
  profileFlags: number;
  about: string;
  location: string;
  profileSocials: Array<{
    providerId: string;
    handle: string;
  }>;
  pinnedPosts?: Array<{
    postId: string;
    accountId: string;
    pos: number;
    createdAt: number;
  }>;
  mediaStoryState?: {
    accountId: string;
    status: number;
    storyCount: number;
    version: number;
    createdAt: number;
    updatedAt: number;
    hasActiveStories: boolean;
  };
  walls?: Array<{
    id: string;
    accountId: string;
    pos?: number;
    name: string;
    description: string;
    metadata: string;
  }>;
  statusId: number;
  lastSeenAt: number;
  avatar: {
    id: string;
    type: number;
    status: number;
    accountId: string;
    mimetype: string;
    flags: number;
    location: string;
    width: number;
    height: number;
    metadata: string;
    updatedAt: number;
    createdAt: number;
    variants: Array<{
      id: string;
      type: number;
      status: number;
      mimetype: string;
      flags: number;
      location: string;
      width: number;
      height: number;
      metadata?: string;
      updatedAt: number;
      locations: Array<{
        locationId: string;
        location: string;
      }>;
    }>;
    variantHash: {};
    locations: Array<{
      locationId: string;
      location: string;
    }>;
  };
  banner: {
    id: string;
    type: number;
    status: number;
    accountId: string;
    mimetype: string;
    flags: number;
    location: string;
    width: number;
    height: number;
    metadata: string;
    updatedAt: number;
    createdAt: number;
    variants: Array<{
      id: string;
      type: number;
      status: number;
      mimetype: string;
      flags: number;
      location: string;
      width: number;
      height: number;
      metadata?: string;
      updatedAt: number;
      locations: Array<{
        locationId: string;
        location: string;
      }>;
    }>;
    variantHash: {};
    locations: Array<{
      locationId: string;
      location: string;
    }>;
  };
  accountMediaLikes: number;
  subscriptionTiers: Array<{
    id: string;
    accountId: string;
    name: string;
    color: string;
    pos: number;
    price: number;
    maxSubscribers: number;
    subscriptionBenefits: Array<string>;
    includedTierIds: Array<string>;
    plans: Array<{
      id: string;
      status: number;
      billingCycle: number;
      price: number;
      useAmounts: number;
      promos: Array<{
        id: string;
        status: number;
        price: number;
        duration: number;
        maxUses: number;
        maxUsesBefore?: number;
        newSubscribersOnly: number;
        description: string;
        startsAt: number;
        endsAt: number;
        uses: number;
      }>;
      uses: number;
    }>;
    maxSubscribersReached?: boolean;
  }>;
  streaming: {
    accountId: string;
    channel: {
      id: string;
      accountId: string;
      playbackUrl: string;
      chatRoomId: string;
      status: number;
      version: number;
      createdAt: number;
      updatedAt: any;
      stream: {
        id: string;
        historyId: string;
        channelId: string;
        accountId: string;
        title: string;
        status: number;
        viewerCount: number;
        version: number;
        createdAt: number;
        updatedAt: any;
        lastFetchedAt: number;
        startedAt: number;
        permissions: {
          permissionFlags: Array<{
            id: string;
            streamId: string;
            type: number;
            flags: number;
            price: number;
            metadata: string;
          }>;
        };
      };
      arn: any;
      ingestEndpoint: any;
    };
    enabled: boolean;
  };
  profileAccess: boolean;
};

export type FanslyMeResponse = {
  account: {
    id: string;
    email: string;
    username: string;
    displayName: any;
    flags: number;
    version: number;
    createdAt: number;
    followCount: number;
    subscriberCount: number;
    permissions: {
      accountPermissionFlags: {
        flags: number;
      };
    };
    timelineStats: {
      accountId: string;
      imageCount: number;
      videoCount: number;
      bundleCount: number;
      bundleImageCount: number;
      bundleVideoCount: number;
      fetchedAt: number;
    };
    statusId: number;
    lastSeenAt: number;
    postLikes: number;
    profileAccessFlags: number;
    profileFlags: number;
    about: string;
    location: string;
    profileSocials: Array<any>;
    pinnedPosts: Array<{
      postId: string;
      accountId: string;
      pos: number;
      createdAt: number;
    }>;
    avatar: {
      id: string;
      type: number;
      status: number;
      accountId: string;
      mimetype: string;
      flags: number;
      filename: string;
      location: string;
      width: number;
      height: number;
      metadata: string;
      updatedAt: number;
      createdAt: number;
      variants: Array<any>;
      variantHash: {};
      locations: Array<{
        locationId: string;
        location: string;
      }>;
    };
    banner: {
      id: string;
      type: number;
      status: number;
      accountId: string;
      mimetype: string;
      flags: number;
      filename: string;
      location: string;
      width: number;
      height: number;
      metadata: string;
      updatedAt: number;
      createdAt: number;
      variants: Array<{
        id: string;
        type: number;
        status: number;
        mimetype: string;
        flags: number;
        filename: string;
        location: string;
        width: number;
        height: number;
        metadata: string;
        updatedAt: number;
        locations: Array<{
          locationId: string;
          location: string;
        }>;
      }>;
      variantHash: {};
      locations: Array<{
        locationId: string;
        location: string;
      }>;
    };
    accountMediaLikes: number;
    mainWallet: {
      id: string;
      balance: number;
      balance64: number;
      accountId: string;
      type: number;
      flags: number;
      walletVersion: number;
    };
    earningsWallet: {
      id: string;
      balance: number;
      balance64: number;
      accountId: string;
      type: number;
      flags: number;
      walletVersion: number;
    };
    streaming: {
      accountId: string;
      channel: {
        id: string;
        accountId: string;
        playbackUrl: string;
        chatRoomId: string;
        status: number;
        version: number;
        createdAt: number;
        updatedAt: any;
        stream: {
          id: string;
          historyId: string;
          channelId: string;
          accountId: string;
          title: string;
          status: number;
          viewerCount: number;
          version: number;
          createdAt: number;
          updatedAt: any;
          lastFetchedAt: number;
          startedAt: number;
          permissions: {
            permissionFlags: Array<any>;
          };
        };
      };
      enabled: boolean;
    };
    profileAccess: boolean;
  };
  correlationId: string;
  checkToken: any;
};

export type Changelog = {
  version: string;
  date: string;
  changes: string;
};

export enum SeasonalEmoteButtonTypes {
  Default = "default",
  NewYears = "newYears",
  Easter = "easter",
  Halloween = "halloween",
  Christmas = "christmas",
}

export type SeasonalEmoteButton = {
  type: SeasonalEmoteButtonTypes;
  startDate: Date;
  endDate: Date;
};
