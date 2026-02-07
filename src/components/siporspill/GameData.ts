
export type GameType = 'truth-dare' | 'would-you-rather' | 'never-have-i-ever' | 'most-likely-to';
export type Category = 'couples' | 'friends' | 'party' | 'mixed';

export interface GameItem {
    id: string;
    text: string;
    type?: 'truth' | 'dare'; // Specific to Truth or Dare
    options?: readonly [string, string]; // Specific to Would You Rather
}

export interface GameModeConfig {
    id: GameType;
    title: string;
    description: string;
    categories: Category[];
}

export const GAME_MODES: GameModeConfig[] = [
    {
        id: 'truth-dare',
        title: 'Truth or Dare',
        description: 'Classic game of secrets and challenges',
        categories: ['couples', 'friends']
    },
    {
        id: 'would-you-rather',
        title: 'Would You Rather',
        description: 'Choose between two difficult scenarios',
        categories: ['party']
    },
    {
        id: 'never-have-i-ever',
        title: 'Never Have I Ever',
        description: 'Reveal your past experiences',
        categories: ['party']
    },
    {
        id: 'most-likely-to',
        title: "Who's Likely To",
        description: 'Point to the person fitting the description',
        categories: ['party']
    }
];

export const CONTENT = {
    'truth-dare': {
        'couples': {
            truths: [
                "What's your favorite thing about our relationship?",
                "When did you first realize you had feelings for me?",
                "What's a secret wish you have for us?",
                "What's your favorite memory of us together?",
                "If you could relive one moment with me, which would it be?",
                "What song reminds you of me and why?",
                "What's something I do that makes you smile every time?",
                "What's your idea of a perfect date with me?",
                "What's one thing you've never told me but want to?",
                "What do you find most attractive about me?",
                "What's your favorite way I show you love?",
                "If we could travel anywhere together, where would it be?",
                "What's something you admire about me?",
                "What's your favorite thing to do together at a café?",
                "What's a dream you have for our future?",
                "What's the sweetest thing I've ever done for you?",
                "What's your favorite coffee drink to share with me?",
                "When do you feel most connected to me?",
                "What's something new you'd like to try together?",
                "What's your favorite thing about how we communicate?"
            ],
            dares: [
                "Whisper something sweet in my ear right now",
                "Hold my hand and look into my eyes for 30 seconds without laughing",
                "Give me three genuine compliments",
                "Share a sip of your coffee with me in the most romantic way",
                "Write 'I love you' on a napkin and slide it to me",
                "Tell me why you chose to be here with me today",
                "Describe our relationship using only coffee terms",
                "Feed me a small bite of your pastry",
                "Tell the barista we're celebrating something special (make it up!)",
                "Draw a heart on my hand with your finger",
                "Say something you love about me in a different language",
                "Take a selfie with me making silly faces",
                "Hum our favorite song together",
                "Tell me your favorite thing about my smile",
                "Hold both my hands and tell me three things you're grateful for",
                "Spell out 'LOVE' using items on our table",
                "Share your favorite daydream about us",
                "Give me a gentle shoulder massage for 30 seconds",
                "Tell me what you were thinking the first time we met",
                "Create a secret handshake with me right now"
            ]
        },
        'friends': {
            truths: [
                "What's the most embarrassing thing that happened to you at a café?",
                "What's your weirdest coffee order ever?",
                "What's a secret talent you've never shown me?",
                "What's the funniest memory you have of us?",
                "If you could only drink one beverage for life, what would it be?",
                "What's your most irrational fear?",
                "What's the worst fashion choice you've ever made?",
                "What's your guilty pleasure song?",
                "What's the strangest food combination you actually enjoy?",
                "What's something you pretend to like but actually don't?",
                "What's your most used emoji and why?",
                "What's the most spontaneous thing you've ever done?",
                "What's a habit you have that you think is weird?",
                "What's your go-to karaoke song?",
                "What's the longest you've gone without showering?",
                "What's your most unpopular opinion?",
                "What's something you're secretly competitive about?",
                "What's the worst gift you've ever received?",
                "What's your most embarrassing autocorrect fail?",
                "What's a childhood fear you still have?"
            ],
            dares: [
                "Order your next drink in a British accent",
                "Take a sip of your coffee with your eyes closed and describe it dramatically",
                "Do your best impression of a coffee machine",
                "Compliment a stranger's coffee choice",
                "Pretend to be a food critic reviewing your pastry",
                "Speak in rhymes for the next 2 minutes",
                "Do a silent dance in your seat for 15 seconds",
                "Try to make me laugh without speaking",
                "Describe your day using only song titles",
                "Act out your morning routine in fast-forward",
                "Speak only in questions for the next minute",
                "Do your best celebrity impression",
                "Hum a song and I have to guess it",
                "Tell a joke in the worst accent you can do",
                "Pretend the sugar packets are precious gems",
                "Do 5 exaggerated yawns in a row",
                "Narrate what you're doing like a nature documentary",
                "Try to sell me this napkin like it's a luxury item",
                "Do your best robot dance while seated",
                "Speak in a whisper for the next 3 questions"
            ]
        }
    },
    'would-you-rather': {
        'party': [
            { id: 'wyr-1', text: "Would you rather always be 10 minutes late or always be 20 minutes early?", options: ["Always late", "Always early"] as const },
            { id: 'wyr-2', text: "Would you rather have the ability to fly or be invisible?", options: ["Fly", "Invisible"] as const },
            { id: 'wyr-3', text: "Would you rather lose all of your money and valuables or all of the pictures you have ever taken?", options: ["Lose Money", "Lose Pictures"] as const },
            { id: 'wyr-4', text: "Would you rather be able to talk with all animals or speak all foreign languages?", options: ["Talk with Animals", "Speak Languages"] as const },
            { id: 'wyr-5', text: "Would you rather live without music or live without movies?", options: ["No Music", "No Movies"] as const },
            { id: 'wyr-6', text: "Would you rather have a pause button for your life or a rewind button?", options: ["Pause Button", "Rewind Button"] as const },
            { id: 'wyr-7', text: "Would you rather be famous when you are alive and forgotten when you die or unknown when you are alive but famous after you die?", options: ["Famous Alive", "Famous Dead"] as const },
            { id: 'wyr-8', text: "Would you rather always contain your laughter or always contain your anger?", options: ["Contain Laughter", "Contain Anger"] as const },
            { id: 'wyr-9', text: "Would you rather never be able to eat meat or never be able to eat vegetables?", options: ["No Meat", "No Veggies"] as const },
            { id: 'wyr-10', text: "Would you rather have a horribly corrupt government or no government?", options: ["Corrupt Gov", "No Gov"] as const }
        ]
    },
    'never-have-i-ever': {
        'party': [
            "Never have I ever gone skinny dipping.",
            "Never have I ever cheated on a test.",
            "Never have I ever faked being sick to get out of work/school.",
            "Never have I ever snooped through someone else's phone.",
            "Never have I ever lied about my age.",
            "Never have I ever broken a bone.",
            "Never have I ever gotten a tattoo.",
            "Never have I ever been to a concert.",
            "Never have I ever met a celebrity.",
            "Never have I ever eaten food out of a trash can."
        ]
    },
    'most-likely-to': {
        'party': [
            "Who is most likely to become a billionaire?",
            "Who is most likely to join a cult?",
            "Who is most likely to survive a zombie apocalypse?",
            "Who is most likely to forget their own birthday?",
            "Who is most likely to cry during a sad movie?",
            "Who is most likely to win a Nobel Prize?",
            "Who is most likely to become a famous actor/actress?",
            "Who is most likely to get arrested for something silly?",
            "Who is most likely to drop their phone in the toilet?",
            "Who is most likely to verify a rumor before spreading it?"
        ]
    }
};
