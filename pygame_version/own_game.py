import pygame
import random

pygame.init()

# Constants
PADDING = 100
SCREEN_WIDTH, SCREEN_HEIGHT = 800+2*PADDING, 600+2*PADDING
GRID_SIZE = 40
APPLE_RADIUS = GRID_SIZE // 4
APPLE_FONT_SIZE = 16
SCORE_FONT_SIZE = 40
GRID_COLOR = (217, 246, 205)
APPLE_COLOR = (241, 36, 54)
HIGHLIGHT_COLOR = (255, 255, 0)
FONT_COLOR = (0, 0, 0)     
TIME_LIMIT = 120

start_ticks = pygame.time.get_ticks()

# Set up the display
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption("Fruit Box Game")

# Font for numbers on apples
font = pygame.font.SysFont('Arial', APPLE_FONT_SIZE)
score_font = pygame.font.SysFont('Arial',SCORE_FONT_SIZE)
# apple_numbers has shape (800/40,600/40) = (20,15)
apple_numbers = [[random.randint(1,9) for _ in range(800//GRID_SIZE)] for _ in range(600//GRID_SIZE)]

# DRAW THE APPLES
def draw_apples():
    for row_idx, row in enumerate(apple_numbers):
        for col_idx, col in enumerate(row):
            #if grid cell = 0 means it's empty so don't draw
            if col==0:
                continue
            x = PADDING + col_idx*GRID_SIZE
            y = PADDING + row_idx*GRID_SIZE
            pygame.draw.circle(screen, APPLE_COLOR, (x + GRID_SIZE//2,y+GRID_SIZE//2),APPLE_RADIUS)
            text = font.render(str(col),True,FONT_COLOR)
            screen.blit(text,(x+GRID_SIZE//2 - text.get_width()//2,y+GRID_SIZE//2-text.get_height()//2))


def highlight_apples(rect):
    global apple_sum
    apple_sum = 0
    rect = pygame.Rect(rect)
    for row_idx,row in enumerate(apple_numbers):
        for col_idx,col in enumerate(row):
            if col==0:
                continue
            x = PADDING + col_idx*GRID_SIZE
            y = PADDING + row_idx*GRID_SIZE
            if rect.collidepoint(x+GRID_SIZE//2,y+GRID_SIZE//2):
                apple_sum += col 
                pygame.draw.circle(screen, HIGHLIGHT_COLOR, (x + GRID_SIZE//2,y+GRID_SIZE//2),APPLE_RADIUS*1.2)
                text = font.render(str(col),True, FONT_COLOR)
                screen.blit(text,(x+GRID_SIZE//2-text.get_width()//2,y+GRID_SIZE//2-text.get_height()//2))

def draw_score():
    score_text = score_font.render(f"Score: {score}", True, FONT_COLOR)
    screen.blit(score_text, (10,10)) #adjust position (10,10) if needed

def draw_time():
    global time_left
    seconds = (pygame.time.get_ticks() - start_ticks) // 1000  # convert milliseconds to seconds
    time_left = TIME_LIMIT - seconds  
    time_text = score_font.render(f"Time Left: {time_left}", True, FONT_COLOR)
    screen.blit(time_text, (SCREEN_WIDTH - 200, 10))  # Position at top-right, adjust as needed

def display_popup():
    popup_rect = pygame.Rect(100, 100, 600, 400)  # Adjust size and position as needed
    pygame.draw.rect(screen, (200, 200, 200), popup_rect)  # Draw popup background
    final_score_text = score_font.render(f"Final Score: {score}", True, FONT_COLOR)
    screen.blit(final_score_text, (popup_rect.x + 50, popup_rect.y + 50))  # Adjust text position as needed


#MAIN GAME LOOP
running=True
is_drawing=False
start_x,start_y = 0,0
apple_sum = 0
score = 0
time_left = 120

while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running=False
        elif event.type == pygame.MOUSEBUTTONDOWN:
            start_x,start_y = event.pos
            is_drawing = True
        elif event.type == pygame.MOUSEBUTTONUP:
            is_drawing = False
            cur_x,cur_y = event.pos 
            if(apple_sum==10):
                rect = pygame.Rect((start_x,start_y, cur_x-start_x,cur_y-start_y))
                for row_idx, row in enumerate(apple_numbers):
                    for col_idx, col in enumerate(row):
                       x = PADDING + col_idx*GRID_SIZE
                       y = PADDING + row_idx*GRID_SIZE
                       if rect.collidepoint(x+GRID_SIZE//2,y+GRID_SIZE//2):
                           if(col!=0):
                               score+=1
                               apple_numbers[row_idx][col_idx] = 0
        elif event.type == pygame.MOUSEMOTION and is_drawing:
            cur_x,cur_y = event.pos
            screen.fill(GRID_COLOR)
            draw_apples()
            highlight_apples((start_x,start_y,cur_x-start_x,cur_y-start_y))
            pygame.draw.rect(screen,FONT_COLOR,(start_x,start_y,cur_x-start_x,cur_y-start_y),1)

    if not is_drawing:
        screen.fill(GRID_COLOR)
        draw_apples()

    draw_score()
    draw_time()
    pygame.display.flip()

pygame.quit()
