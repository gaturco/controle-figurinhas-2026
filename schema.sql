CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stickers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number INTEGER NOT NULL,
  code TEXT NOT NULL UNIQUE,
  team TEXT NOT NULL,
  player_name TEXT NOT NULL,
  is_special BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS user_stickers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  sticker_id UUID REFERENCES stickers(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('collected', 'repeated')) NOT NULL DEFAULT 'collected',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, sticker_id)
);

INSERT INTO stickers (number, code, team, player_name, is_special) VALUES
(1,'BRA-01','Brasil','Alisson',false),(2,'BRA-02','Brasil','Danilo',false),(3,'BRA-03','Brasil','Marquinhos',false),(4,'BRA-04','Brasil','Gabriel Magalhães',false),(5,'BRA-05','Brasil','Wendell',false),(6,'BRA-06','Brasil','Casemiro',false),(7,'BRA-07','Brasil','Bruno Guimarães',false),(8,'BRA-08','Brasil','Rodrygo',false),(9,'BRA-09','Brasil','Vinícius Jr.',true),(10,'BRA-10','Brasil','Neymar Jr.',true),(11,'BRA-11','Brasil','Endrick',false),
(12,'ARG-01','Argentina','E. Martínez',false),(13,'ARG-02','Argentina','Nahuel Molina',false),(14,'ARG-03','Argentina','Cristian Romero',false),(15,'ARG-04','Argentina','Lisandro Martínez',false),(16,'ARG-05','Argentina','N. Tagliafico',false),(17,'ARG-06','Argentina','Rodrigo De Paul',false),(18,'ARG-07','Argentina','Enzo Fernández',false),(19,'ARG-08','Argentina','Alexis Mac Allister',false),(20,'ARG-09','Argentina','Ángel Di María',false),(21,'ARG-10','Argentina','Lionel Messi',true),(22,'ARG-11','Argentina','Julián Álvarez',false),
(23,'FRA-01','França','Mike Maignan',false),(24,'FRA-02','França','Jules Koundé',false),(25,'FRA-03','França','Dayot Upamecano',false),(26,'FRA-04','França','William Saliba',false),(27,'FRA-05','França','Theo Hernandez',false),(28,'FRA-06','França','Aurélien Tchouaméni',false),(29,'FRA-07','França','Adrien Rabiot',false),(30,'FRA-08','França','Antoine Griezmann',true),(31,'FRA-09','França','Ousmane Dembélé',false),(32,'FRA-10','França','Kylian Mbappé',true),(33,'FRA-11','França','Marcus Thuram',false),
(34,'GER-01','Alemanha','Manuel Neuer',false),(35,'GER-02','Alemanha','Joshua Kimmich',false),(36,'GER-03','Alemanha','Antonio Rüdiger',false),(37,'GER-04','Alemanha','Nico Schlotterbeck',false),(38,'GER-05','Alemanha','David Raum',false),(39,'GER-06','Alemanha','Toni Kroos',true),(40,'GER-07','Alemanha','İlkay Gündoğan',false),(41,'GER-08','Alemanha','Florian Wirtz',false),(42,'GER-09','Alemanha','Leroy Sané',false),(43,'GER-10','Alemanha','Kai Havertz',false),(44,'GER-11','Alemanha','Niclas Füllkrug',false),
(45,'ENG-01','Inglaterra','Jordan Pickford',false),(46,'ENG-02','Inglaterra','Kyle Walker',false),(47,'ENG-03','Inglaterra','Harry Maguire',false),(48,'ENG-04','Inglaterra','John Stones',false),(49,'ENG-05','Inglaterra','Luke Shaw',false),(50,'ENG-06','Inglaterra','Declan Rice',false),(51,'ENG-07','Inglaterra','Jude Bellingham',true),(52,'ENG-08','Inglaterra','Phil Foden',false),(53,'ENG-09','Inglaterra','Marcus Rashford',false),(54,'ENG-10','Inglaterra','Harry Kane',true),(55,'ENG-11','Inglaterra','Bukayo Saka',false),
(56,'ESP-01','Espanha','Unai Simón',false),(57,'ESP-02','Espanha','Dani Carvajal',false),(58,'ESP-03','Espanha','Aymeric Laporte',false),(59,'ESP-04','Espanha','Robin Le Normand',false),(60,'ESP-05','Espanha','Alejandro Balde',false),(61,'ESP-06','Espanha','Rodri',true),(62,'ESP-07','Espanha','Pedri',false),(63,'ESP-08','Espanha','Fabián Ruiz',false),(64,'ESP-09','Espanha','Lamine Yamal',true),(65,'ESP-10','Espanha','Álvaro Morata',false),(66,'ESP-11','Espanha','Nico Williams',false),
(67,'POR-01','Portugal','Diogo Costa',false),(68,'POR-02','Portugal','João Cancelo',false),(69,'POR-03','Portugal','Rúben Dias',false),(70,'POR-04','Portugal','Pepe',false),(71,'POR-05','Portugal','Nuno Mendes',false),(72,'POR-06','Portugal','Vitinha',false),(73,'POR-07','Portugal','Bruno Fernandes',true),(74,'POR-08','Portugal','Bernardo Silva',false),(75,'POR-09','Portugal','Rafael Leão',false),(76,'POR-10','Portugal','Cristiano Ronaldo',true),(77,'POR-11','Portugal','Gonçalo Ramos',false);