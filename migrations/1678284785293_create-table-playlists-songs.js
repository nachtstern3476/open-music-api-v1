exports.up = pgm => {
    pgm.createTable('playlists_songs', {
        id: 'id',
        playlist_id: {
            type: 'VARCHAR(50)',
            notNull: true
        },
        song_id: {
            type: 'VARCHAR(50)',
            notNull: true
        }
    });
};

exports.down = pgm => {
    pgm.dropTable('playlists_songs');
};
