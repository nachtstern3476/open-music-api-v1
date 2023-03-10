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
};

exports.down = pgm => {
    pgm.dropTable('activities');
};
