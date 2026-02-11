
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
                "What's your favorite thing about how we communicate?",
                // Coffee-themed truths for couples
                "If our love story was a coffee drink, what would it be and why?",
                "What's the most romantic coffee shop moment we've shared?",
                "Do you prefer morning coffee together or evening coffee dates?",
                "What's your favorite coffee aroma that reminds you of me?",
                "If we opened a café together, what would we name it?",
                "What's your perfect coffee-fueled Sunday morning with me?",
                "Which coffee region would you want to visit together - Ethiopia, Colombia, or Italy?",
                "What's the coziest coffee memory we've created together?",
                "If you could only drink one type of coffee with me forever, which would it be?",
                "What's your favorite thing about our coffee ritual together?",
                "Describe our relationship as a seasonal coffee drink",
                "What's the most thoughtful coffee-related thing I've done for you?",
                "If we were baristas, what would our couple signature drink be?",
                "What's your favorite coffee shop to people-watch together?",
                "Morning person or night owl - how does coffee fit into our rhythm?",
                "What's the cutest thing I've done while caffeinated?",
                "If our kisses had a coffee flavor, what would they taste like?",
                "What's your dream coffee-fueled adventure with me?",
                "Do you prefer sharing one cup or having our own drinks?",
                "What's the most comforting thing about drinking coffee with me?",
                "If we were coffee beans, what roast level would we be?",
                "What's your favorite coffee-related nickname for me?",
                "Describe our perfect coffee shop date in three words",
                "What's the warmest feeling you get when we sip coffee together?",
                "If you could create a coffee blend inspired by us, what would be in it?",
                "What's your favorite way we wake up together with coffee?",
                "Which coffee moment with me would you frame as a photo?",
                "What's the sweetest coffee surprise you've received from me?",
                "If our love was measured in espresso shots, how many would it be?",
                "What's your ideal coffee-fueled lazy morning routine with me?"
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
                "Create a secret handshake with me right now",
                // Coffee-themed dares for couples
                "Feed me a bite of your pastry without using your hands",
                "Write a coffee-themed poem about us on a napkin",
                "Do your best impression of a coffee machine while I watch",
                "Create a heart shape with your hands around your coffee cup",
                "Tell the barista your coffee order is 'whatever my date is having'",
                "Stir your coffee while maintaining eye contact for 30 seconds",
                "Draw a latte art heart in the air with your finger",
                "Pretend we're in a coffee commercial and act super romantic",
                "Whisper your coffee order to the server in a dramatic way",
                "Balance a sugar packet on your nose for 10 seconds",
                "Create a coffee-themed love story in 30 seconds",
                "Pretend your spoon is a microphone and serenade me",
                "Do your best slow-motion coffee sip while looking at me",
                "Write our initials in the condensation on the table",
                "Pretend to be a coffee critic reviewing our date",
                "Give me an Eskimo kiss with your coffee-warm nose",
                "Act out how you think coffee beans fall in love",
                "Create a secret coffee code language with me right now",
                "Pretend to propose to me with a coffee stirrer as a ring",
                "Give your coffee drink a romantic name and explain why",
                "Do a dramatic coffee toast speech dedicated to us",
                "Pretend the sugar packets are love letters and read one to me",
                "Create a coffee-themed pickup line and use it on me",
                "Act like a barista and take my 'order' for a perfect date",
                "Pretend we're in a romantic movie coffee shop scene",
                "Give me butterfly kisses while humming a coffee jingle",
                "Create a love potion recipe using only coffee ingredients",
                "Pretend your coffee cup is a crystal ball and predict our future",
                "Do your best impression of foam art forming a heart",
                "Write a coffee shop AU (alternate universe) story about us"
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
                "What's a childhood fear you still have?",
                // Coffee-themed truths for friends
                "What's your coffee order and what does it say about your personality?",
                "Have you ever pretended to like a fancy coffee you actually hated?",
                "What's the most you've ever spent on a single cup of coffee?",
                "Do you judge people based on their coffee orders?",
                "What's your most controversial coffee opinion?",
                "Have you ever used a coffee shop just for the WiFi without buying anything?",
                "What's the weirdest place you've ever spilled coffee?",
                "Do you actually know what all the coffee sizes mean at Starbucks?",
                "What's your secret coffee shop ritual?",
                "Have you ever stolen someone's coffee by accident?",
                "What's the most hipster coffee trend you've secretly tried?",
                "Do you actually enjoy the taste of black coffee or just pretend to?",
                "What's your most caffeinated adventure story?",
                "Have you ever faked being a coffee snob to impress someone?",
                "What's the worst coffee you've ever had and where?",
                "Do you have a secret cheap coffee brand you love?",
                "What's your coffee shop pet peeve?",
                "Have you ever fallen asleep in a coffee shop?",
                "What's your most creative excuse for being late that involved coffee?",
                "Do you actually know the difference between a latte and a cappuccino?",
                "What's your coffee-fueled confession?",
                "Have you ever used coffee as a meal replacement?",
                "What's your most embarrassing coffee order pronunciation fail?",
                "Do you secretly prefer instant coffee sometimes?",
                "What's the most remote place you've had coffee?",
                "Have you ever had coffee so strong it made you hallucinate?",
                "What's your coffee shop bathroom horror story?",
                "Do you judge cafes by their pastry selection or their coffee?",
                "What's your most desperate moment trying to get caffeine?",
                "Have you ever named your coffee before drinking it?",
                "What's your coffee shop work productivity confession?"
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
                "Speak in a whisper for the next 3 questions",
                // Coffee-themed dares for friends
                "Order your coffee using only hand gestures, no words",
                "Pretend you're a barista and take everyone's 'order' with attitude",
                "Balance a coffee cup on your head while walking to the bathroom",
                "Ask a stranger to rate your coffee order from 1-10",
                "Pretend you're a coffee bean describing your journey from farm to cup",
                "Do your best espresso machine sound effects for 30 seconds",
                "Take a selfie with your coffee and post it with a dramatic caption",
                "Pretend the cinnamon shaker is a microphone and sing your order",
                "Walk to the counter and ask if they serve 'deconstructed coffee'",
                "Do an interpretive dance of how you feel after your first sip",
                "Pretend you're a coffee snob sending back your drink",
                "Use a coffee stirrer as a magic wand and 'cast spells' on everyone's drinks",
                "Speak like a Shakespearean character ordering coffee for 1 minute",
                "Pretend you're a spy and your coffee order is a secret code",
                "Do your best impression of someone before their morning coffee",
                "Create a commercial for this coffee shop and perform it",
                "Pretend the table is a stage and you're a coffee cup doing stand-up comedy",
                "Ask someone nearby what their coffee would be if it were a person",
                "Do a dramatic reading of the ingredients on the sugar packet",
                "Pretend you're a barista trainer giving me a lesson on latte art",
                "Speak in coffee puns for the next 2 minutes",
                "Pretend you're a detective investigating a 'case of the missing foam'",
                "Do your best impression of a French person at a Parisian café",
                "Create a secret handshake involving coffee cup movements",
                "Pretend you're a coffee bean roasting and getting darker",
                "Give a motivational speech to everyone's coffee cups",
                "Do an auctioneer voice trying to sell your pastry to the highest bidder",
                "Pretend you're a scientist presenting findings on 'coffeeology'",
                "Act like you're in a slow-motion coffee commercial",
                "Pretend you're a time traveler from the future where coffee is illegal"
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
