import {Question} from "../types/CommonTypes";

const quiz: Array<Question> = [
    {
        content: 'Quel maréchal français meurt à Essling en 1809 ?',
        answers: [
            {
                label: 'Michel Ney',
                isRight: false
            },
            {
                label: 'Jean Lannes',
                isRight: true,
            },
            {
                label: 'Jean-de-Dieu Soult',
                isRight: false
            },
            {
                label: 'Louis-Nicolas Davout',
                isRight: false
            }
        ]
    },
    {
        content: 'Qui est à l\'origine d\'Ethereum ?',
        answers: [
            {
                label: 'Vitalik Buterin',
                isRight: true,
            },
            {
                label: 'Vytalik Buterin',
                isRight: false,
            },
            {
                label: 'Vitalyk Buterin',
                isRight: false,
            },
            {
                label: 'Vytalyk Buterin',
                isRight: false
            }
        ]
    },
    {
        content: 'Quel série de jeux vidéos permet d\'incarner Kazuma Kiryu ?',
        answers: [
            {
                label: 'Shenmue',
                isRight: false,
            },
            {
                label: 'Yakuza',
                isRight: true,
            },
            {
                label: 'Ninja Gaiden',
                isRight: false,
            },
            {
                label: 'Fire Emblem',
                isRight: false
            }
        ]
    },
    {
        content: 'Après Hokkaido, Honshu et Kyushu, comment se nomme la quatrième grande île du Japon ?',
        answers: [
            {
                label: 'Tsushima',
                isRight: false
            },
            {
                label: 'Okinawa',
                isRight: false,
            },
            {
                label: 'Iwojima',
                isRight: false
            },
            {
                label: 'Shikoku',
                isRight: true,
            }
        ]
    },
    {
        content: 'Quel artiste américain interprète Johnny B. Goode ?',
        answers: [
            {
                label: 'Jimi Hendrix',
                isRight: false,
            },
            {
                label: 'Bruce Springsteen',
                isRight: false,
            },
            {
                label: 'Chuck Berry',
                isRight: true,
            },
            {
                label: 'Frank Sinatra',
                isRight: false,
            }
        ]
    }
]

function generateQuiz() {
    const copy = JSON.parse(JSON.stringify(quiz));

    return copy.map(question => {
        for (const answer of question.answers) {
            delete answer.isRight;
        }

        return question;
    });
}

export {generateQuiz}