exports.up = pgm => {
    pgm.createTable('activities', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true
        },
        user_id: {
            type: 'VARCHAR(50)',
            notNull: true
        },
        playlist_id: {
            type: 'VARCHAR(50)',
            notNull: true
        },
        song_id: {
            type: 'VARCHAR(50)',
            notNull: true
        },
        action: {
            type: 'VARCHAR(12)',
            notNull: true
        },
        time: {
            type: 'timestamptz',
            notNull: true
        }
    });

    pgm.addConstraint('activities', 'fk_activities.playlist_id_playlists.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');
};

exports.down = pgm => {
    pgm.dropTable('activities');
};
