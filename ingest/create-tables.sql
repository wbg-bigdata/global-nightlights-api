CREATE TABLE public.observations (
    position_id character varying(255),
    rade9 numeric,
    rad numeric,
    scanned_at timestamp without time zone
);

CREATE TABLE public.positions (
    id character varying(255) NOT NULL,
    geometry public.geometry(Point,4326),
    population numeric,
    n_sets numeric
);


