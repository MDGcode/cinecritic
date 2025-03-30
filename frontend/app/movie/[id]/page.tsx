import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Loader2, Star, Tag } from "lucide-react";
import ReviewForm from "@/app/components/review-form";
import { ReviewsList } from "@/app/components/review-list";
// Define interfaces for the movie data structure
interface Genre {
  id: number;
  name: string;
}

interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
}

interface Movie {
  id: number;
  title: string;
  overview: string | null;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  runtime: number;
  tagline: string | null;
  status: string;
  original_language: string;
  budget: number;
  revenue: number;
  genres: Genre[];
  production_companies: ProductionCompany[];
}

async function getMovieDetails(id: string): Promise<Movie | null> {
  const url = `https://api.themoviedb.org/3/movie/${id}?language=en-US`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_KEY}`,
    },
    next: { revalidate: 3600 },
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch movie: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
}

function formatRuntime(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function LoadingState() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
        <p className="text-xl text-gray-500">Loading movie details...</p>
      </div>
    </div>
  );
}

async function MovieContent({ id }: { id: string }) {
  const movie = await getMovieDetails(id);

  if (!movie) {
    notFound();
  }

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/">
          <button className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
            <ArrowLeft size={16} />
            Back to Discover
          </button>
        </Link>
      </div>

      {backdropUrl && (
        <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-xl overflow-hidden mb-8">
          <Image
            src={backdropUrl || "/placeholder.svg"}
            alt={movie.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent dark:from-gray-900" />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
        <div>
          {posterUrl ? (
            <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden shadow-lg">
              <Image
                src={posterUrl || "/placeholder.svg"}
                alt={movie.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 300px"
              />
            </div>
          ) : (
            <div className="aspect-[2/3] w-full bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">No poster available</span>
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {movie.title}
            {movie.release_date && (
              <span className="text-gray-500 font-normal ml-2">
                ({new Date(movie.release_date).getFullYear()})
              </span>
            )}
          </h1>

          {movie.tagline && (
            <p className="text-lg italic text-gray-500 mb-4">{movie.tagline}</p>
          )}

          <div className="flex flex-wrap gap-2 mb-6">
            {movie.vote_average > 0 && (
              <span className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                {movie.vote_average.toFixed(1)}
              </span>
            )}

            {movie.release_date && (
              <span className="flex items-center gap-1 px-3 py-1 border border-gray-200 rounded-full text-sm">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(movie.release_date).toLocaleDateString()}
              </span>
            )}

            {movie.runtime > 0 && (
              <span className="flex items-center gap-1 px-3 py-1 border border-gray-200 rounded-full text-sm">
                <Clock className="h-3.5 w-3.5" />
                {formatRuntime(movie.runtime)}
              </span>
            )}
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Overview</h2>
            <p className="text-gray-600">
              {movie.overview || "No overview available."}
            </p>
          </div>

          {movie.genres && movie.genres.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Genres</h2>
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre: Genre) => (
                  <span
                    key={genre.id}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                  >
                    <Tag className="h-3.5 w-3.5" />
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {movie.status && (
              <div>
                <h3 className="font-medium">Status</h3>
                <p className="text-gray-600">{movie.status}</p>
              </div>
            )}

            {movie.original_language && (
              <div>
                <h3 className="font-medium">Original Language</h3>
                <p className="text-gray-600">
                  {new Intl.DisplayNames(["en"], { type: "language" }).of(
                    movie.original_language
                  )}
                </p>
              </div>
            )}

            {movie.budget > 0 && (
              <div>
                <h3 className="font-medium">Budget</h3>
                <p className="text-gray-600">{formatCurrency(movie.budget)}</p>
              </div>
            )}

            {movie.revenue > 0 && (
              <div>
                <h3 className="font-medium">Revenue</h3>
                <p className="text-gray-600">{formatCurrency(movie.revenue)}</p>
              </div>
            )}
          </div>

          {movie.production_companies &&
            movie.production_companies.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  Production Companies
                </h2>
                <div className="flex flex-wrap gap-4">
                  {movie.production_companies.map(
                    (company: ProductionCompany) => (
                      <div key={company.id} className="flex items-center gap-2">
                        {company.logo_path ? (
                          <div className="relative h-8 w-16 bg-white rounded p-1 border border-gray-200">
                            <Image
                              src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                              alt={company.name}
                              fill
                              className="object-contain"
                              sizes="64px"
                            />
                          </div>
                        ) : (
                          <div className="h-8 w-8 bg-gray-100 rounded flex items-center justify-center">
                            <span className="text-xs">
                              {company.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <span>{company.name}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
        </div>
      </div>
      <ReviewForm movieId={movie.id} />
    </div>
  );
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  return (
    <Suspense fallback={<LoadingState />}>
      <MovieContent id={id} />
      <ReviewsList movieId={Number(id)} />
    </Suspense>
  );
}
