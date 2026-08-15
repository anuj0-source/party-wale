import random

songs = [
    ('Kala Chashma', 'Amar Arshi'), ('Kar Gayi Chull', 'Badshah'), ('Abhi Toh Party', 'Badshah'),
    ('DJ Waley Babu', 'Badshah'), ('Proper Patola', 'Badshah'), ('Garmi', 'Badshah'),
    ('Aankh Marey', 'Neha Kakkar'), ('Dilbar', 'Neha Kakkar'), ('O Saki Saki', 'Neha Kakkar'),
    ('Cheez Badi', 'Neha Kakkar'), ('Coca Cola', 'Neha Kakkar'), ('Morni Banke', 'Guru Randhawa'),
    ('High Rated Gabru', 'Guru Randhawa'), ('Suit Suit', 'Guru Randhawa'), ('Lahore', 'Guru Randhawa'),
    ('Bom Diggy Diggy', 'Zack Knight'), ('Swag Se Swagat', 'Vishal Dadlani'), ('Ghungroo', 'Arijit Singh'),
    ('Badtameez Dil', 'Benny Dayal'), ('Let\'s Nacho', 'Badshah'), ('The Breakup Song', 'Arijit Singh'),
    ('Kar Gayi Chull', 'Fazilpuria'), ('Tamma Tamma Again', 'Bappi Lahiri'), ('Chalti Hai Kya 9 Se 12', 'Dev Negi'),
    ('Husnn Hai Suhaana', 'Chandana Dixit'), ('Mirchi', 'DIVINE'), ('Genda Phool', 'Badshah'),
    ('Burjkhalifa', 'Shashi'), ('Nachde Ne Saare', 'Jasleen Royal'), ('Gallan Goodiyaan', 'Yashita Sharma'),
    ('London Thumakda', 'Labh Janjua'), ('Baby Doll', 'Kanika Kapoor'), ('Chittiyaan Kalaiyaan', 'Kanika Kapoor'),
    ('Sunny Sunny', 'Yo Yo Honey Singh'), ('Blue Eyes', 'Yo Yo Honey Singh'), ('Lungi Dance', 'Yo Yo Honey Singh'),
    ('Desi Kalakaar', 'Yo Yo Honey Singh'), ('Dope Shope', 'Yo Yo Honey Singh'), ('Angreji Beat', 'Yo Yo Honey Singh'),
    ('High Heels', 'Jaz Dhami'), ('Naagin', 'Aastha Gill'), ('Buzz', 'Aastha Gill'),
    ('Kamariya', 'Aastha Gill'), ('Illegal Weapon 2.0', 'Jasmine Sandlas'), ('Yaar Naa Miley', 'Jasmine Sandlas'),
    ('Raat Ke Dhai Baje', 'Suresh Wadkar'), ('Desi Girl', 'Shankar Mahadevan'), ('Maa Da Laadla', 'Master Saleem'),
    ('Aahun Aahun', 'Neeraj Shridhar'), ('Twist', 'Neeraj Shridhar'), ('Chor Bazaari', 'Neeraj Shridhar'),
    ('Tum Hi Ho Bandhu', 'Neeraj Shridhar'), ('Lat Lag Gayee', 'Benny Dayal'), ('Party On My Mind', 'KK'),
    ('Subha Hone Na De', 'Mika Singh'), ('Dhinka Chika', 'Mika Singh'), ('Aaj Ki Party', 'Mika Singh'),
    ('Jumme Ki Raat', 'Mika Singh'), ('Gandi Baat', 'Mika Singh'), ('Aankh Marey', 'Kumar Sanu'),
    ('Main Tera Boyfriend', 'Arijit Singh'), ('Sweety Tera Drama', 'Dev Negi'), ('Zingaat', 'Ajay-Atul'),
    ('Param Sundari', 'Shreya Ghoshal'), ('Chaka Chak', 'Shreya Ghoshal'), ('Nadiyon Paar', 'Shamur'),
    ('Kusu Kusu', 'Zahrah S Khan'), ('Dance Meri Rani', 'Guru Randhawa'), ('Zaalima Coca Cola', 'Shreya Ghoshal'),
    ('Makhna', 'Tanishk Bagchi'), ('Ek Toh Kum Zindagani', 'Neha Kakkar'), ('Hawa Hawa', 'Mika Singh'),
    ('Tu Meri', 'Vishal Dadlani'), ('Bang Bang', 'Benny Dayal'), ('Ude Dil Befikre', 'Benny Dayal'),
    ('Nashe Si Chadh Gayi', 'Arijit Singh'), ('Ik Vaari Aa', 'Arijit Singh'), ('Malhari', 'Vishal Dadlani'),
    ('Tattad Tattad', 'Aditya Narayan'), ('Khalibali', 'Shivam Pathak'), ('Bala', 'Vishal Dadlani'),
    ('Shaitan Ka Saala', 'Sohail Sen'), ('Dil Chori', 'Yo Yo Honey Singh'), ('Chhote Chhote Peg', 'Yo Yo Honey Singh'),
    ('Mundiyan', 'Navraj Hans'), ('Khaab', 'Akhil'), ('Illegal Weapon', 'Garry Sandhu'),
    ('Wakhra Swag', 'Navv Inder'), ('Kala Chashma (Remix)', 'Badshah'), ('Saturday Saturday', 'Indeep Bakshi'),
    ('Abhi Toh Party Shuru Hui Hai', 'Badshah'), ('Kar Gayi Chull', 'Badshah'), ('Lets Nacho', 'Badshah'),
    ('Kala Chashma', 'Badshah'), ('Haseeno Ka Deewana', 'Raftaar'), ('The Humma Song', 'A.R. Rahman'),
    ('Laila Main Laila', 'Pawni Pandey'), ('Tamma Tamma Again', 'Bappi Lahiri'), ('Tu Cheez Badi Hai Mast Mast', 'Udit Narayan'),
    ('Oonchi Hai Building 2.0', 'Anu Malik'), ('Chalti Hai Kya 9 Se 12', 'Dev Negi'), ('Ek Do Teen', 'Palak Muchhal'),
    ('Mundiyan', 'Navraj Hans'), ('Zingaat', 'Ajay-Atul'), ('Dilbar', 'Neha Kakkar'),
    ('Aankh Marey', 'Mika Singh'), ('Tere Bin', 'Rahat Fateh Ali Khan'), ('Poster Lagwa Do', 'Mika Singh'),
    ('Coca Cola', 'Tony Kakkar'), ('Photo', 'Karan Sehmbi'), ('Hauli Hauli', 'Garry Sandhu'),
    ('O Saki Saki', 'Neha Kakkar'), ('Sheher Ki Ladki', 'Badshah'), ('Psycho Saiyaan', 'Sachet Tandon'),
    ('Enni Soni', 'Guru Randhawa'), ('Ghungroo', 'Arijit Singh'), ('Bala', 'Vishal Dadlani'),
    ('Naagin', 'Aastha Gill'), ('Garmi', 'Badshah'), ('Muqabla', 'Yash Narvekar'),
    ('Illegal Weapon 2.0', 'Garry Sandhu'), ('Lagdi Lahore Di', 'Guru Randhawa'), ('Dus Bahane 2.0', 'KK'),
    ('Bhankas', 'Bappi Lahiri'), ('Genda Phool', 'Badshah'), ('BurjKhalifa', 'Shashi'),
    ('Nadiyon Paar', 'Shamur'), ('Param Sundari', 'Shreya Ghoshal'), ('Ranjha', 'B Praak'),
    ('Raataan Lambiyan', 'Jubin Nautiyal'), ('Jugnu', 'Badshah'), ('Bijlee Bijlee', 'Harrdy Sandhu'),
    ('Dance Meri Rani', 'Guru Randhawa'), ('Kusu Kusu', 'Zahrah S Khan'), ('Chaka Chak', 'Shreya Ghoshal'),
    ('Tip Tip', 'Udit Narayan'), ('Aashiqui Aa Gayi', 'Arijit Singh'), ('Doobey', 'Lothika'),
    ('Gehraiyaan', 'Lothika'), ('Meri Jaan', 'Neeti Mohan'), ('Dholida', 'Janhvi Shrimankar'),
    ('Bhalobashar Morshum', 'Shreya Ghoshal'), ('Kesariya', 'Arijit Singh'), ('Deva Deva', 'Arijit Singh'),
    ('Dance Ka Bhoot', 'Arijit Singh'), ('Manike', 'Yohani'), ('Apna Bana Le', 'Arijit Singh'),
    ('Jhoome Jo Pathaan', 'Arijit Singh'), ('Besharam Rang', 'Shilpa Rao'), ('Tere Pyaar Mein', 'Arijit Singh'),
    ('Show Me The Thumka', 'Sunidhi Chauhan'), ('Naiyo Lagda', 'Kamaal Khan'), ('Billi Billi', 'Sukhbir'),
    ('O Bedardeya', 'Arijit Singh'), ('Pyaar Hota Kayi Baar Hai', 'Arijit Singh'), ('Tere Vaaste', 'Varun Jain'),
    ('Phir Aur Kya Chahiye', 'Arijit Singh'), ('Tu Hai Toh Mujhe Phir Aur Kya Chahiye', 'Arijit Singh'), ('Chaleya', 'Arijit Singh'),
    ('Zinda Banda', 'Anirudh Ravichander'), ('Not Ramaiya Vastavaiya', 'Anirudh Ravichander'), ('Heeriye', 'Arijit Singh'),
    ('What Jhumka?', 'Arijit Singh'), ('Tum Kya Mile', 'Arijit Singh'), ('Ve Kamleya', 'Arijit Singh'),
    ('Dhindhora Baje Re', 'Darshan Raval'), ('Roar', 'Vishal Dadlani'), ('Kudmayi', 'Sachet Tandon'),
    ('Main Parwaana', 'Arijit Singh'), ('Chaleya (Arabic)', 'Arijit Singh'), ('Lutt Putt Gaya', 'Arijit Singh'),
    ('O Maahi', 'Arijit Singh'), ('Banda', 'Arijit Singh'), ('Nikle The Kabhi Hum Ghar Se', 'Arijit Singh'),
    ('Chaleya (Tamil)', 'Anirudh Ravichander'), ('Chaleya (Telugu)', 'Anirudh Ravichander'), ('Zinda Banda (Tamil)', 'Anirudh Ravichander'),
    ('Zinda Banda (Telugu)', 'Anirudh Ravichander'), ('Not Ramaiya Vastavaiya (Tamil)', 'Anirudh Ravichander'), ('Not Ramaiya Vastavaiya (Telugu)', 'Anirudh Ravichander'),
    ('Faraatta', 'Arijit Singh'), ('Aararaari Raaro', 'Jubin Nautiyal'), ('Chaleya (Instrumental)', 'Anirudh Ravichander'),
    ('Zinda Banda (Instrumental)', 'Anirudh Ravichander'), ('Not Ramaiya Vastavaiya (Instrumental)', 'Anirudh Ravichander'), ('Jawan Title Track', 'Anirudh Ravichander'),
    ('Gadar 2 Theme', 'Mithoon'), ('Udd Jaa Kaale Kaava', 'Udit Narayan'), ('Main Nikla Gaddi Leke', 'Udit Narayan'),
    ('Khairiyat', 'Arijit Singh'), ('Dil Jhoom', 'Arijit Singh'), ('Chal Tere Ishq Mein', 'Neeti Mohan'),
    ('Sura Soi', 'Mithoon'), ('Rubaru', 'Kamal Khan'), ('Baari Barsi', 'Romy'),
    ('Oonchi Oonchi Deewarein', 'Arijit Singh'), ('Satranga', 'Arijit Singh'), ('Arjan Vailly', 'Bhupinder Babbal'),
    ('Hua Main', 'Raghav Chaitanya'), ('Pehle Bhi Main', 'Vishal Mishra'), ('Kashmir', 'Shreya Ghoshal'),
    ('Saari Duniya Jalaa Denge', 'B Praak'), ('Hairani', 'Arijit Singh'), ('Papa Meri Jaan', 'Sonu Nigam'),
    ('Haiwaan', 'Arijit Singh'), ('Sher Khul Gaye', 'Vishal Dadlani'), ('Ishq Jaisa Kuch', 'Vishal-Sheykhar')
]

more = [('Baby', 'Justin Bieber'), ('Shape of You', 'Ed Sheeran'), ('Despacito', 'Luis Fonsi'),
        ('Levitating', 'Dua Lipa'), ('Blinding Lights', 'The Weeknd'), ('Uptown Funk', 'Mark Ronson'),
        ('Party Rock Anthem', 'LMFAO'), ('Wake Me Up', 'Avicii'), ('Titanium', 'David Guetta'),
        ('Animals', 'Martin Garrix'), ('Lean On', 'Major Lazer'), ('Faded', 'Alan Walker'),
        ('Closer', 'The Chainsmokers'), ("Don't Let Me Down", 'The Chainsmokers'), ('Mi Gente', 'J Balvin'),
        ('Taki Taki', 'DJ Snake'), ('Magenta Riddim', 'DJ Snake'), ('Turn Down for What', 'DJ Snake'),
        ('Get Low', 'DJ Snake'), ('Bum Bum Tam Tam', 'MC Fioti'), ('Con Calma', 'Daddy Yankee'),
        ('Danza Kuduro', 'Don Omar'), ("Hips Don't Lie", 'Shakira'), ('Waka Waka', 'Shakira'),
        ('Despacito (Remix)', 'Luis Fonsi')]
songs.extend(more)
songs = songs[:200]

working_ids = ['K4DyBUG242c', 'bM7SZ5SBzyY', '3nQNiWdeH2Q', 'p7ZsBPK656s', 'EP625xQIGzs', 'J2X5mJ3HDYE', 'AOeY-nDp7hI', 'VtKbiyyVZks']

playlist_str = """export type SongIntensity = 'medium' | 'high' | 'extreme';

export interface Song {
  id: string;
  title: string;
  artist: string;
  youtubeId: string;
  bpm: number;
  intensity: SongIntensity;
  bassDrops: number[];
}

export const playlist: Song[] = [
"""

for i, (title, artist) in enumerate(songs):
    bpm = random.choice([100, 108, 112, 120, 128, 130])
    intensity = random.choice(['medium', 'high', 'extreme'])
    yid = working_ids[i % len(working_ids)]
    playlist_str += f"""  {{
    id: 'song-{i}',
    title: '{title.replace("'", "\\'")}',
    artist: '{artist.replace("'", "\\'")}',
    youtubeId: '{yid}',
    bpm: {bpm},
    intensity: '{intensity}',
    bassDrops: [15, 30, 45, 60, 75, 90],
  }},
"""

playlist_str += "];\n"

with open('src/data/playlist.ts', 'w', encoding='utf-8') as f:
    f.write(playlist_str)

print("Playlist generated successfully with 200 songs.")
