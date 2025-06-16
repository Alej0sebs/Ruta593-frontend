-- Insertar provincias

INSERT INTO Provinces (id,name)
VALUES 
    (1, 'Azuay'),
    (2, 'Bolívar'),
    (3, 'Cañar'),
    (4, 'Carchi'),
    (5, 'Chimborazo'),
    (6, 'Cotopaxi'),
    (7, 'El Oro'),
    (8, 'Esmeraldas'),
    (9, 'Galápagos'),
    (10, 'Guayas'),
    (11, 'Imbabura'),
    (12, 'Loja'),
    (13, 'Los Ríos'),
    (14, 'Manabí'),
    (15, 'Morona Santiago'),
    (16, 'Napo'),
    (17, 'Orellana'),
    (18, 'Pastaza'),
    (19, 'Pichincha'),
    (20, 'Santa Elena'),
    (21, 'Santo Domingo de los Tsáchilas'),
    (22, 'Sucumbíos'),
    (23, 'Tungurahua'),
    (24, 'Zamora Chinchipe');

-- Insertar ciudades
INSERT INTO cities (id,province_id,name)
VALUES
    -- Azuay
    (1, 1, 'Cuenca'),
    (2, 1, 'Gualaceo'),
    (3, 1, 'Paute'),
    (4, 1, 'Girón'),
    (5, 1, 'Turi'),
    (6, 1, 'Llacao'),
    (7, 1, 'Quinge'),
    (8, 1, 'Chiquintad'),
    (9, 1, 'San Felipe de Molleturo'),
    (10, 1, 'Nulti'),
    (11, 1, 'Victoria del Portete'),
    (12, 1, 'Tomebamba'),
    (13, 1, 'Sidcay'),
    (14, 1, 'Sinincay'),
    (15, 1, 'Octavio Cordero Palacios (Sta. Rosa)'),
    (16, 1, 'Paccha'),
    (17, 1, 'Valle'),
    (18, 1, 'Santa Ana'),
    (19, 1, 'Luis Galarza Orella'),
    (20, 1, 'La Unión'),
    
    -- Bolívar
    (21, 2, 'Guaranda'),
    (22, 2, 'San Miguel'),
    (23, 2, 'Chillanes'),
    (24, 2, 'Echeandía'),
    (25, 2, 'Caluma'),
    (26, 2, 'Las Naves'),

    -- Cañar
    (27, 3, 'Azogues'),
    (28, 3, 'Biblián'),
    (29, 3, 'Cañar'),
    (30, 3, 'La Troncal'),
    (31, 3, 'El Tambo'),
    (32, 3, 'Déleg'),
    (33, 3, 'Suscal'),

    -- Carchi
    (34, 4, 'Tulcán'),
    (35, 4, 'Mira'),
    (36, 4, 'Bolívar'),
    (37, 4, 'Espejo'),
    (38, 4, 'Montúfar'),
    (39, 4, 'San Pedro de Huaca'),

    -- Chimborazo
    (40, 5, 'Riobamba'),
    (41, 5, 'Guano'),
    (42, 5, 'Chambo'),
    (43, 5, 'Colta'),
    (44, 5, 'Cumandá'),
    (45, 5, 'Alausí'),
    (46, 5, 'Pallatanga'),
    (47, 5, 'Chunchi'),

    -- Cotopaxi
    (48, 6, 'Latacunga'),
    (49, 6, 'Salcedo'),
    (50, 6, 'Pujilí'),
    (51, 6, 'La Maná'),
    (52, 6, 'Saquisilí'),
    (53, 6, 'Sigchos'),

    -- El Oro
    (54, 7, 'Machala'),
    (55, 7, 'Pasaje'),
    (56, 7, 'Santa Rosa'),
    (57, 7, 'Huaquillas'),
    (58, 7, 'Arenillas'),
    (59, 7, 'El Guabo'),
    (60, 7, 'Zaruma'),
    (61, 7, 'Piñas'),
    (62, 7, 'Portovelo'),
    (63, 7, 'Atahualpa'),
    (64, 7, 'Balsas'),
    (65, 7, 'Marcabelí'),
    (66, 7, 'Chilla'),

    -- Esmeraldas
    (67, 8, 'Esmeraldas'),
    (68, 8, 'Atacames'),
    (69, 8, 'Eloy Alfaro'),
    (70, 8, 'Muisne'),
    (71, 8, 'Quinindé'),
    (72, 8, 'San Lorenzo'),

    -- Galápagos
    (73, 9, 'Puerto Baquerizo Moreno'),
    (74, 9, 'Puerto Ayora'),
    (75, 9, 'Puerto Villamil'),

    -- Guayas
    (76, 10, 'Guayaquil'),
    (77, 10, 'Durán'),
    (78, 10, 'Milagro'),
    (79, 10, 'Samborondón'),
    (80, 10, 'Daule'),
    (81, 10, 'Playas'),
    (82, 10, 'El Triunfo'),
    (83, 10, 'Salitre'),
    (84, 10, 'Balao'),
    (85, 10, 'Colimes'),
    (86, 10, 'Pedro Carbo'),
    (87, 10, 'Naranjal'),
    (88, 10, 'Santa Lucía'),
    (89, 10, 'Yaguachi'),

    -- Imbabura
    (90, 11, 'Ibarra'),
    (91, 11, 'Otavalo'),
    (92, 11, 'Cotacachi'),
    (93, 11, 'Antonio Ante'),
    (94, 11, 'Pimampiro'),
    (95, 11, 'Urcuquí'),

    -- Loja
    (96, 12, 'Loja'),
    (97, 12, 'Catamayo'),
    (98, 12, 'Macará'),
    (99, 12, 'Sozoranga'),
    (100, 12, 'Pindal'),
    (101, 12, 'Quilanga'),
    (102, 12, 'Calvas'),
    (103, 12, 'Gonzanamá'),
    (104, 12, 'Paltas'),
    (105, 12, 'Saraguro'),
    (106, 12, 'Zapotillo'),

    -- Los Ríos
    (107, 13, 'Babahoyo'),
    (108, 13, 'Quevedo'),
    (109, 13, 'Ventanas'),
    (110, 13, 'Vinces'),
    (111, 13, 'Mocache'),
    (112, 13, 'Puebloviejo'),
    (113, 13, 'Quinsaloma'),
    (114, 13, 'Urdaneta'),

    -- Manabí
    (115, 14, 'Portoviejo'),
    (116, 14, 'Manta'),
    (117, 14, 'Montecristi'),
    (118, 14, 'Jaramijó'),
    (119, 14, 'Sucre'),
    (120, 14, 'Tosagua'),
    (121, 14, 'Rocafuerte'),
    (122, 14, 'Chone'),
    (123, 14, 'El Carmen'),
    (124, 14, 'Bahía de Caráquez'),

    -- Morona Santiago
    (125, 15, 'Macas'),
    (126, 15, 'Santiago'),
    (127, 15, 'Gualaquiza'),
    (128, 15, 'Sucúa'),
    (129, 15, 'Huamboya'),
    (130, 15, 'Logroño'),
    (131, 15, 'Pablo Sexto'),
    (132, 15, 'San Juan Bosco'),

    -- Napo
    (133, 16, 'Tena'),
    (134, 16, 'Archidona'),
    (135, 16, 'El Chaco'),
    (136, 16, 'Quijos'),
    (137, 16, 'Carlos Julio Arosemena Tola'),

    -- Orellana
    (138, 17, 'Coca'),
    (139, 17, 'Loreto'),
    (140, 17, 'La Joya de los Sachas'),
    (141, 17, 'Aguarico'),

    -- Pastaza
    (142, 18, 'Puyo'),
    (143, 18, 'Mera'),
    (144, 18, 'Santa Clara'),
    (145, 18, 'Arajuno'),

    -- Pichincha
    (146, 19, 'Quito'),
    (147, 19, 'Cayambe'),
    (148, 19, 'Sangolquí'),
    (149, 19, 'Pedro Vicente Maldonado'),
    (150, 19, 'San Miguel de los Bancos'),
    (151, 19, 'Puerto Quito'),
    (152, 19, 'Mejía'),

    -- Santa Elena
    (153, 20, 'Santa Elena'),
    (154, 20, 'La Libertad'),
    (155, 20, 'Salinas'),

    -- Santo Domingo de los Tsáchilas
    (156, 21, 'Santo Domingo'),

    -- Sucumbíos
    (157, 22, 'Nueva Loja'),
    (158, 22, 'Shushufindi'),
    (159, 22, 'Lago Agrio'),
    (160, 22, 'Cascales'),
    (161, 22, 'Cuyabeno'),

    -- Tungurahua
    (162, 23, 'Ambato'),
    (163, 23, 'Baños'),
    (164, 23, 'Cevallos'),
    (165, 23, 'Mocha'),
    (166, 23, 'Patate'),
    (167, 23, 'Píllaro'),
    (168, 23, 'Quero'),
    (169, 23, 'Tisaleo'),

    -- Zamora Chinchipe
    (170, 24, 'Zamora'),
    (171, 24, 'Yantzaza'),
    (172, 24, 'Guayzimi'),
    (173, 24, 'Centinela del Cóndor'),
    (174, 24, 'Nangaritza'),
    (175, 24, 'Palanda'),
    (176, 24, 'Paquisha');
